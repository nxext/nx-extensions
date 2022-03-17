/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  CompilerHost as NgCompilerHost,
  CompilerOptions as NgCompilerOptions,
  NgtscProgram,
} from '@angular/compiler-cli';
import * as assert from 'assert';
import { createHash } from 'crypto';
import {
  BuilderProgram,
  CompilerHost,
  CompilerOptions,
  createAbstractBuilder,
  createEmitAndSemanticDiagnosticsBuilderProgram,
  createIncrementalCompilerHost,
  createModuleResolutionCache,
  CustomTransformers,
  Diagnostic,
  EmitAndSemanticDiagnosticsBuilderProgram,
  ScriptTarget,
  SourceFile,
} from 'typescript';
import { externalizePath, normalizePath } from './path';
import { SourceFileCache } from './cache';
import {
  augmentHostWithCaching,
  augmentHostWithDependencyCollection,
  augmentHostWithNgcc,
  augmentProgramWithVersioning,
} from './host';
import { NgccProcessor } from './ngcc_processor';
import { AngularVitePluginOptions } from './plugin-options';
import { EmitFileResult, FileEmitter } from './symbol';
import {
  createAotTransformers,
  createJitTransformers,
  mergeTransformers,
} from './transformation';
import { join } from 'path';
import { ResolvedConfig } from 'vite';
import { findProjects, loadConfig } from './utils/load-tsconfig';

function initializeNgccProcessor(
  target: ScriptTarget,
  root: string,
  tsconfig: string,
  compilerNgccModule: typeof import('@angular/compiler-cli/ngcc') | undefined
): { processor: NgccProcessor; errors: string[]; warnings: string[] } {
  const mainFields = ['es2015', 'browser', 'module', 'main'];

  if (target >= ScriptTarget.ES2020) {
    mainFields.unshift('es2020');
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // The compilerNgccModule field is guaranteed to be defined during a compilation
  // due to the `beforeCompile` hook. Usage of this property accessor prior to the
  // hook execution is an implementation error.
  assert.ok(
    compilerNgccModule,
    `'@angular/compiler-cli/ngcc' used prior to Webpack compilation.`
  );

  const processor = new NgccProcessor(
    compilerNgccModule,
    mainFields,
    warnings,
    errors,
    root,
    tsconfig
  );

  return { processor, errors, warnings };
}

interface FileEmitHistoryItem {
  length: number;
  hash: Uint8Array;
}

export class AngularVitePlugin {
  private readonly pluginOptions: AngularVitePluginOptions;
  private compilerCliModule?: typeof import('@angular/compiler-cli');
  private compilerNgccModule?: typeof import('@angular/compiler-cli/ngcc');
  private watchMode?: boolean;
  private ngtscNextProgram?: NgtscProgram;
  private builder?: EmitAndSemanticDiagnosticsBuilderProgram;
  private sourceFileCache?: SourceFileCache;
  private readonly fileDependencies = new Map<string, Set<string>>();
  private readonly requiredFilesToEmit = new Set<string>();
  private readonly requiredFilesToEmitCache = new Map<
    string,
    EmitFileResult | undefined
  >();
  private readonly fileEmitHistory = new Map<string, FileEmitHistoryItem>();
  private ngccProcessor: NgccProcessor | undefined;
  private previousUnused: Set<string> | undefined;

  constructor(
    options: Partial<AngularVitePluginOptions> = {},
    private viteResolvedConfig: ResolvedConfig
  ) {
    this.pluginOptions = {
      emitClassMetadata: false,
      emitNgModuleScope: false,
      jitMode: false,
      substitutions: {},
      directTemplateLoading: true,
      tsconfig: 'tsconfig.json',
      ...options,
    };
  }

  async initializeCompilerCli(): Promise<void> {
    if (this.compilerCliModule) {
      return;
    }

    this.compilerCliModule = await new Function(
      `return import('@angular/compiler-cli');`
    )();
    this.compilerNgccModule = await new Function(
      `return import('@angular/compiler-cli/ngcc');`
    )();
  }

  private get compilerCli(): typeof import('@angular/compiler-cli') {
    assert.ok(
      this.compilerCliModule,
      `'@angular/compiler-cli' used prior to vite compilation.`
    );

    return this.compilerCliModule;
  }

  get options(): AngularVitePluginOptions {
    return this.pluginOptions;
  }

  private loadConfiguration() {
    const {
      options: compilerOptions,
      rootNames,
      errors,
    } = this.compilerCli.readConfiguration(
      join(this.viteResolvedConfig.root, this.pluginOptions.tsconfig),
      this.pluginOptions.compilerOptions
    ) as unknown as {
      options: CompilerOptions;
      rootNames: string[];
      errors: Diagnostic[];
    };
    (compilerOptions as any).enableIvy = true;
    compilerOptions.noEmitOnError = false;
    (compilerOptions as any).suppressOutputPathCheck = true;
    compilerOptions.outDir = undefined;
    compilerOptions.inlineSources = compilerOptions.sourceMap;
    compilerOptions.inlineSourceMap = false;
    compilerOptions.mapRoot = undefined;
    compilerOptions.sourceRoot = undefined;
    (compilerOptions as any).allowEmptyCodegenFiles = false;
    (compilerOptions as any).annotationsAs = 'decorators';
    (compilerOptions as any).enableResourceInlining = false;

    return { compilerOptions, rootNames, errors };
  }

  private updateJitProgram(
    compilerOptions: CompilerOptions,
    rootNames: readonly string[],
    host: NgCompilerHost
  ) {
    let builder;
    if (this.watchMode) {
      builder = this.builder = createEmitAndSemanticDiagnosticsBuilderProgram(
        rootNames,
        compilerOptions,
        host as CompilerHost,
        this.builder
      );
    } else {
      // When not in watch mode, the startup cost of the incremental analysis can be avoided by
      // using an abstract builder that only wraps a TypeScript program.
      builder = createAbstractBuilder(
        rootNames,
        compilerOptions,
        host as CompilerHost
      );
    }

    const transformers = createJitTransformers(builder, this.compilerCli);

    return {
      fileEmitter: this.createFileEmitter(builder, transformers, () => []),
      builder,
      internalFiles: undefined,
    };
  }

  private updateAotProgram(
    compilerOptions: NgCompilerOptions,
    rootNames: string[],
    host: NgCompilerHost
  ) {
    // Create the Angular specific program that contains the Angular compiler
    const angularProgram = new this.compilerCli.NgtscProgram(
      rootNames,
      compilerOptions,
      host,
      this.ngtscNextProgram
    );
    const angularCompiler = angularProgram.compiler;

    // The `ignoreForEmit` return value can be safely ignored when emitting. Only files
    // that will be bundled (requested by Webpack) will be emitted. Combined with TypeScript's
    // eliding of type only imports, this will cause type only files to be automatically ignored.
    // Internal Angular type check files are also not resolvable by the bundler. Even if they
    // were somehow errantly imported, the bundler would error before an emit was attempted.
    // Diagnostics are still collected for all files which requires using `ignoreForDiagnostics`.
    const { ignoreForDiagnostics, ignoreForEmit } = angularCompiler;

    // SourceFile versions are required for builder programs.
    // The wrapped host inside NgtscProgram adds additional files that will not have versions.
    const typeScriptProgram = angularProgram.getTsProgram();
    augmentProgramWithVersioning(typeScriptProgram);

    let builder: BuilderProgram | EmitAndSemanticDiagnosticsBuilderProgram;
    if (this.watchMode) {
      builder = this.builder = createEmitAndSemanticDiagnosticsBuilderProgram(
        typeScriptProgram,
        host as CompilerHost,
        this.builder
      );
      this.ngtscNextProgram = angularProgram;
    } else {
      // When not in watch mode, the startup cost of the incremental analysis can be avoided by
      // using an abstract builder that only wraps a TypeScript program.
      builder = createAbstractBuilder(typeScriptProgram, host as CompilerHost);
    }

    // Update semantic diagnostics cache
    const affectedFiles = new Set<SourceFile>();

    // Analyze affected files when in watch mode for incremental type checking
    if ('getSemanticDiagnosticsOfNextAffectedFile' in builder) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const result = builder.getSemanticDiagnosticsOfNextAffectedFile(
          undefined,
          (sourceFile) => {
            // If the affected file is a TTC shim, add the shim's original source file.
            // This ensures that changes that affect TTC are typechecked even when the changes
            // are otherwise unrelated from a TS perspective and do not result in Ivy codegen changes.
            // For example, changing @Input property types of a directive used in another component's
            // template.
            if (
              ignoreForDiagnostics.has(sourceFile) &&
              sourceFile.fileName.endsWith('.ngtypecheck.ts')
            ) {
              // This file name conversion relies on internal compiler logic and should be converted
              // to an official method when available. 15 is length of `.ngtypecheck.ts`
              const originalFilename =
                sourceFile.fileName.slice(0, -15) + '.ts';
              const originalSourceFile =
                builder.getSourceFile(originalFilename);
              if (originalSourceFile) {
                affectedFiles.add(originalSourceFile);
              }

              return true;
            }

            return false;
          }
        );

        if (!result) {
          break;
        }

        affectedFiles.add(result.affected as SourceFile);
      }
    }

    const transformers = createAotTransformers(builder, this.pluginOptions);

    // Required to support asynchronous resource loading
    // Must be done before creating transformers or getting template diagnostics
    const pendingAnalysis = angularCompiler
      .analyzeAsync()
      .then(() => {
        this.requiredFilesToEmit.clear();

        for (const sourceFile of builder.getSourceFiles()) {
          if (sourceFile.isDeclarationFile) {
            continue;
          }

          // Collect sources that are required to be emitted
          if (
            !ignoreForEmit.has(sourceFile) &&
            !angularCompiler.incrementalDriver.safeToSkipEmit(sourceFile)
          ) {
            this.requiredFilesToEmit.add(normalizePath(sourceFile.fileName));

            // If required to emit, diagnostics may have also changed
            if (!ignoreForDiagnostics.has(sourceFile)) {
              affectedFiles.add(sourceFile);
            }
          }
        }

        // Collect new Angular diagnostics for files affected by changes
        const OptimizeFor = this.compilerCli.OptimizeFor;
        const optimizeDiagnosticsFor =
          affectedFiles.size <= 1
            ? OptimizeFor.SingleFile
            : OptimizeFor.WholeProgram;
        for (const affectedFile of affectedFiles) {
          const angularDiagnostics = angularCompiler.getDiagnosticsForFile(
            affectedFile,
            optimizeDiagnosticsFor
          );
          this.sourceFileCache?.updateAngularDiagnostics(
            affectedFile.getText(),
            angularDiagnostics
          );
        }

        return {
          emitter: this.createFileEmitter(
            builder,
            mergeTransformers(
              angularCompiler.prepareEmit().transformers,
              transformers
            ),
            () => [],
            (sourceFile) => {
              this.requiredFilesToEmit.delete(
                normalizePath(sourceFile.fileName)
              );
              angularCompiler.incrementalDriver.recordSuccessfulEmit(
                sourceFile
              );
            }
          ),
        };
      })
      .catch((err) => ({
        errorMessage: err instanceof Error ? err.message : `${err}`,
      }));

    const analyzingFileEmitter: FileEmitter = async (file) => {
      const analysis = await pendingAnalysis;

      if ('errorMessage' in analysis) {
        throw new Error(analysis.errorMessage);
      }

      return analysis.emitter(file);
    };

    return {
      fileEmitter: analyzingFileEmitter,
      builder,
      internalFiles: ignoreForEmit,
    };
  }

  private createFileEmitter(
    program: BuilderProgram,
    transformers: CustomTransformers = {},
    getExtraDependencies: (sourceFile: SourceFile) => Iterable<string>,
    onAfterEmit?: (sourceFile: SourceFile) => void
  ): FileEmitter {
    return async (file: string) => {
      const filePath = normalizePath(file);
      if (this.requiredFilesToEmitCache.has(filePath)) {
        return this.requiredFilesToEmitCache.get(filePath);
      }

      const sourceFile = program.getSourceFile(filePath);
      if (!sourceFile) {
        return undefined;
      }

      let content: string | undefined;
      let map: string | undefined;
      program.emit(
        sourceFile,
        (filename, data) => {
          if (filename.endsWith('.map')) {
            map = data;
          } else if (filename.endsWith('.js')) {
            content = data;
          }
        },
        undefined,
        undefined,
        transformers
      );

      onAfterEmit?.(sourceFile);

      // Capture emit history info for Angular rebuild analysis
      const hash = content
        ? (await this.addFileEmitHistory(filePath, content)).hash
        : undefined;

      const dependencies = [
        ...(this.fileDependencies.get(filePath) || []),
        ...getExtraDependencies(sourceFile),
      ].map(externalizePath);

      return { content, map, dependencies, hash };
    };
  }

  private async addFileEmitHistory(
    filePath: string,
    content: string
  ): Promise<FileEmitHistoryItem> {
    const historyData: FileEmitHistoryItem = {
      length: content.length,
      hash: createHash('md5').update(content).digest(),
    };

    this.fileEmitHistory.set(filePath, historyData);

    return historyData;
  }

  private async getFileEmitHistory(
    filePath: string
  ): Promise<FileEmitHistoryItem> {
    return this.fileEmitHistory.get(filePath) as FileEmitHistoryItem;
  }

  async transform(
    code: string,
    id: string
  ): Promise<{ map: string | undefined; code: string } | undefined> {
    // Initialize and process eager ngcc if not already setup
    if (!this.ngccProcessor) {
      const projects = findProjects(this.viteResolvedConfig.root);
      const tsConfig = loadConfig(projects[0], undefined, true);

      const target =
        tsConfig?.compilerOptions?.target ?? tsConfig?.target ?? 'ES2017';
      const tsTarget: ScriptTarget = ScriptTarget[
        target.toLocaleUpperCase()
      ] as unknown as ScriptTarget;

      const {
        processor,
        errors: NgccError,
        warnings,
      } = initializeNgccProcessor(
        tsTarget,
        this.viteResolvedConfig.root,
        join(this.viteResolvedConfig.root, this.pluginOptions.tsconfig),
        this.compilerNgccModule
      );
      processor.process();
      if (NgccError) {
        NgccError.forEach((e) => console.error(e));
      }
      if (warnings) {
        warnings.forEach((e) => console.warn(e));
      }
      this.ngccProcessor = processor;
    }

    this.watchMode = this.viteResolvedConfig.command === 'serve';

    const { compilerOptions, errors } = this.loadConfiguration();
    if (errors?.length) {
      errors.forEach((er) => console.error(er));
    }

    const host = createIncrementalCompilerHost(
      compilerOptions as CompilerOptions
    );

    let cache = this.sourceFileCache;
    // let changedFiles;
    // if (cache) {
    // changedFiles = new Set<string>();
    // for (const changedFile of [...compiler.modifiedFiles, ...compiler.removedFiles]) {
    //   const normalizedChangedFile = normalizePath(changedFile);
    //   // Invalidate file dependencies
    //   this.fileDependencies.delete(normalizedChangedFile);
    //   // Invalidate existing cache
    //   cache.invalidate(normalizedChangedFile);

    //   changedFiles.add(normalizedChangedFile);
    // }
    // } else {
    // Initialize a new cache
    cache = new SourceFileCache();
    // Only store cache if in watch mode
    if (this.watchMode) {
      this.sourceFileCache = cache;
    }
    // }

    augmentHostWithCaching(host, cache);

    const moduleResolutionCache = createModuleResolutionCache(
      host.getCurrentDirectory(),
      host.getCanonicalFileName.bind(host),
      compilerOptions as CompilerOptions
    );

    // Setup source file dependency collection
    augmentHostWithDependencyCollection(
      host,
      this.fileDependencies,
      moduleResolutionCache
    );

    // Setup on demand ngcc
    augmentHostWithNgcc(host, this.ngccProcessor, moduleResolutionCache);

    const { fileEmitter, builder, internalFiles } = this.pluginOptions.jitMode
      ? this.updateJitProgram(
          compilerOptions,
          // rootNames,
          [id],
          host as NgCompilerHost
        )
      : this.updateAotProgram(
          compilerOptions as NgCompilerOptions,
          // rootNames,
          [id],
          host as NgCompilerHost
        );

    // Set of files used during the unused TypeScript file analysis
    const currentUnused = new Set<string>();

    for (const sourceFile of builder.getSourceFiles()) {
      if (internalFiles?.has(sourceFile)) {
        continue;
      }

      // Ensure all program files are considered part of the compilation and will be watched.
      // Webpack does not normalize paths. Therefore, we need to normalize the path with FS seperators.
      // compilation.fileDependencies.add(externalizePath(sourceFile.fileName));

      // Add all non-declaration files to the initial set of unused files. The set will be
      // analyzed and pruned after all Webpack modules are finished building.
      if (!sourceFile.isDeclarationFile) {
        currentUnused.add(normalizePath(sourceFile.fileName));
      }
    }

    const result = await fileEmitter(id);
    if (result) {
      return {
        map: result.map,
        code: result?.content?.replace(/\/\/# sourceMappingURL.*/, '') ?? '',
      };
    }
    return;
  }
}
