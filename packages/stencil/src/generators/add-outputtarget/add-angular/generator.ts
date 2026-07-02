import {
  addDependenciesToPackageJson,
  applyChangesToString,
  ensurePackage,
  getWorkspaceLayout,
  joinPathFragments,
  NX_VERSION,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';
import * as ts from 'typescript';
import { relative } from 'path';
import { getDistDir } from '../../../utils/fileutils';
import { addOutputTarget } from '../../../stencil-core-utils';
import { createSourceFile, ScriptTarget } from 'typescript';
import {
  addDeclarationToModule,
  addExportToModule,
} from '../../../utils/angular-ast-utils';
import { getProjectTsImportPath } from '../../storybook-configuration/generator';
import { addAfterLastImport, addImport } from '@nxext/common';
import { addGlobal } from '@nx/js';

async function prepareAngularLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const angularProjectName = `${options.projectName}-angular`;
  const angularProjectDir = `libs/${angularProjectName}`;

  await ensurePackage('@nx/angular', NX_VERSION);
  // `@nx/angular`'s root entry ships the Angular-framework build (no Node
  // exports); `/generators` is Node-only and, unlike other `@nx/*` optional
  // peers, has no top-level .d.ts stub for classic `moduleResolution: "node"`
  // to resolve its exports-map-only subpath.
  // @ts-expect-error -- see comment above; resolves fine at runtime
  const generators = await import('@nx/angular/generators');
  const libraryTarget = await generators.libraryGenerator(host, {
    directory: angularProjectDir,
    skipFormat: true,
    publishable: options.publishable,
    importPath: options.importPath,
    // `addLibraryDirectives`/`angular-ast-utils.ts` below patch a generated
    // `*.module.ts` to wire up the Stencil directive proxies — Angular 21's
    // `standalone: true` default skips creating that module entirely.
    standalone: false,
    // Forward the schema's own unitTestRunner choice; left unset, Angular
    // 21+ defaults publishable libraries to `vitest-angular`, which then
    // hard-validates against a vitest version this workspace doesn't pin.
    unitTestRunner: options.unitTestRunner,
  });

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/angular-output-target': STENCIL_OUTPUTTARGET_VERSION['angular'],
    }
  );

  return libraryTarget;
}

function addAngularOutputtarget(
  host: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const angularProjectConfig = readProjectConfiguration(
    host,
    `${projectName}-angular`
  );
  const realtivePath = relative(
    getDistDir(stencilProjectConfig.root),
    angularProjectConfig.root
  );
  const proxyPath = joinPathFragments(
    realtivePath,
    'src/generated/directives/proxies.ts'
  );
  const arrayPath = joinPathFragments(
    realtivePath,
    'src/generated/directives/index.ts'
  );

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(
      stencilConfigSource,
      `import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';`
    ),
    ...addOutputTarget(
      stencilConfigSource,
      `
      angularOutputTarget({
          componentCorePackage: '${packageName}',
          directivesProxyFile: '${proxyPath}',
          directivesArrayFile: '${arrayPath}',
          valueAccessorConfigs: angularValueAccessorBindings
        }),
      `
    ),
  ]);
  host.write(stencilConfigPath, changes);

  addGlobal(
    host,
    stencilConfigSource,
    stencilConfigPath,
    'const angularValueAccessorBindings: ValueAccessorConfig[] = [];'
  );
}

function addLibraryDirectives(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const angularProjectName = `${options.projectName}-angular`;
  const { libsDir } = getWorkspaceLayout(host);

  // `@nx/angular`'s libraryGenerator (Angular 21+) names the module file
  // `<project>-module.ts`, not the older `<project>.module.ts`.
  const modulePath = joinPathFragments(
    `${libsDir}/${angularProjectName}/src/lib/${angularProjectName}-module.ts`
  );

  if (!host.exists(modulePath)) {
    return;
  }

  const sourceText = host.read(modulePath, 'utf-8');
  let sourceFile = createSourceFile(
    modulePath,
    sourceText,
    ScriptTarget.Latest,
    true
  );
  sourceFile = addDeclarationToModule(
    host,
    sourceFile,
    modulePath,
    '...DIRECTIVES'
  );
  sourceFile = addExportToModule(host, sourceFile, modulePath, '...DIRECTIVES');

  const changes = applyChangesToString(sourceFile.getFullText(), [
    ...addImport(
      sourceFile,
      `import { DIRECTIVES } from '../generated/directives';`
    ),
    ...addImport(
      sourceFile,
      `import { defineCustomElements} from '${getProjectTsImportPath(
        host,
        options.projectName
      )}/loader';`
    ),
    addAfterLastImport(sourceFile, `\ndefineCustomElements();\n`),
  ]);

  host.write(modulePath, changes);
}

export async function addAngularGenerator(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const libraryTarget = await prepareAngularLibrary(host, options);

  addLibraryDirectives(host, options);

  const {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  } = calculateStencilSourceOptions(host, options.projectName);

  addAngularOutputtarget(
    host,
    options.projectName,
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName
  );

  return libraryTarget;
}

export default addAngularGenerator;
