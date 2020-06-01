import {
  CompilerSystem,
  Config,
  ConfigFlags,
  createNodeLogger,
  createNodeSystem,
  Logger,
  runTask,
  TaskCommand,
} from '@stencil/core/cli';
import { StencilBuildOptions } from '../build/schema';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { copyFile, projectRootDir, ProjectType } from '@nrwl/workspace';
import { loadConfig } from '@stencil/core/compiler';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { StencilTestOptions } from '../test/schema';
import { StencilE2EOptions } from '../e2e/schema';
import { writeJsonFile } from '@nrwl/workspace/src/utils/fileutils';
import { OutputTarget } from '@stencil/core/internal';
import { ensureDirExist, fileExists } from './fileutils';

function getCompilerExecutingPath() {
  return require.resolve('@stencil/core/compiler');
}

export function createStencilConfig(
  taskCommand: TaskCommand,
  options: StencilBuildOptions | StencilTestOptions,
  context: BuilderContext,
  createStencilCompilerOptions: (
    taskCommand: TaskCommand,
    options: StencilBuildOptions
  ) => ConfigFlags
): Observable<Config> {
  const projectDir: string = projectRootDir(options.projectType);
  const configFilePath = `${projectDir}/${context.target.project}/stencil.config.ts`;

  const flags: ConfigFlags = createStencilCompilerOptions(taskCommand, options);
  const logger: Logger = createNodeLogger(process);
  const sys: CompilerSystem = createNodeSystem(process);

  if (sys.getCompilerExecutingPath == null) {
    sys.getCompilerExecutingPath = getCompilerExecutingPath;
  }

  if (flags.ci) {
    logger.colors = false;
  }

  return from(
    loadConfig({
      config: {
        flags,
      },
      configPath: configFilePath,
      logger,
      sys,
    })
  ).pipe(
    map((loadConfigResults) => {
      const { workspaceRoot } = context;
      const projectTypeDir = projectRootDir(options.projectType);
      const projectName = context.target.project;
      const distDir = `${workspaceRoot}/dist/${projectTypeDir}/${projectName}`;
      const projectRoot = `${workspaceRoot}/${projectTypeDir}/${projectName}`;

      return {
        config: loadConfigResults.config,
        distDir: distDir,
        projectRoot: projectRoot,
        projectName: projectName,
      };
    }),
    tap((values) => {
      ensureDirExist(values.distDir);

      if (options.projectType == ProjectType.Library) {
        const pkgJson = `${values.projectRoot}/package.json`;
        if (fileExists(pkgJson)) {
          copyFile(pkgJson, values.distDir);
        } else {
          const libPackageJson = {
            name: values.projectName,
            main: 'dist/index.js',
            module: 'dist/index.mjs',
            es2015: 'dist/esm/index.mjs',
            es2017: 'dist/esm/index.mjs',
            types: 'dist/types/index.d.ts',
            collection: 'dist/collection/collection-manifest.json',
            'collection:main': 'dist/collection/index.js',
            unpkg: `dist/${values.projectName}/${values.projectName}.js`,
            files: ['dist/', 'loader/'],
          };

          writeJsonFile(`${values.distDir}/package.json`, libPackageJson);
        }
      }

      return values.config;
    }),
    map((value) => {
      const pathVariables = [
        'dir',
        'appDir',
        'buildDir',
        'indexHtml',
        'esmDir',
        'systemDir',
        'systemLoaderFile',
        'file',
        'esmLoaderPath',
        'collectionDir',
        'typesDir',
        'legacyLoaderFile',
        'esmEs5Dir',
        'cjsDir',
        'cjsIndexFile',
        'esmIndexFile',
        'componentDts',
      ];
      const outputTargets: OutputTarget[] = value.config.outputTargets.map(
        (outputTarget) => {
          pathVariables.forEach((pathVar) => {
            if (
              outputTarget[pathVar] != null &&
              !(outputTarget[pathVar] as string).endsWith('src')
            ) {
              outputTarget = Object.assign(outputTarget, {
                [pathVar]: (outputTarget[pathVar] as string).replace(
                  value.projectRoot,
                  value.distDir
                ),
              });
            }
          });

          return outputTarget;
        }
      );

      const devServerConfig = Object.assign(value.config.devServer, {
        root: value.config.devServer.root.replace(
          value.projectRoot,
          value.distDir
        ),
      });
      return Object.assign(
        value.config,
        { outputTargets: outputTargets },
        { devServer: devServerConfig }
      );
    })
  );
}

export function createStencilProcess() {
  return function (source: Observable<Config>): Observable<BuilderOutput> {
    return source.pipe(
      switchMap((config) => runTask(process, config, config.flags.task)),
      map(() => ({ success: true })),
      catchError((err) => of({ success: false, error: err }))
    );
  };
}

export function parseRunParameters(
  runOptions: string[],
  options: StencilBuildOptions | StencilTestOptions | StencilE2EOptions
) {
  Object.keys(options).forEach((optionKey) => {
    if (typeof options[optionKey] === 'boolean' && options[optionKey]) {
      runOptions.push(`--${optionKey}`);
    }
  });

  return runOptions;
}
