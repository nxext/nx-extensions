import {
  addDependenciesToPackageJson,
  applyChangesToString,
  convertNxGenerator,
  ensurePackage,
  getWorkspaceLayout,
  joinPathFragments,
  NX_VERSION,
  readProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addToGitignore } from '../../../utils/utillities';
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
import { addAfterLastImport, addImport } from '../../../utils/ast-utils';
import { addGlobal } from '@nx/js';

async function prepareAngularLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const angularProjectName = `${options.projectName}-angular`;
  const { libsDir } = getWorkspaceLayout(host);

  await ensurePackage('@nx/angular', NX_VERSION);
  const generators = await import('@nx/angular/generators');
  const libraryTarget = await generators.libraryGenerator(host, {
    name: angularProjectName,
    skipFormat: true,
    publishable: options.publishable,
    importPath: options.importPath,
  });

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/angular-output-target': STENCIL_OUTPUTTARGET_VERSION['angular'],
    }
  );

  addToGitignore(host, `${libsDir}/${angularProjectName}/**/generated`);

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

  const modulePath = joinPathFragments(
    `${libsDir}/${angularProjectName}/src/lib/${angularProjectName}.module.ts`
  );
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
export const addAngularSchematic = convertNxGenerator(addAngularGenerator);
