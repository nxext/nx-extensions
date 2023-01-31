import {
  addDependenciesToPackageJson,
  applyChangesToString,
  convertNxGenerator,
  ensurePackage,
  getWorkspaceLayout,
  joinPathFragments,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import {
  addAfterLastImport,
  addImport,
  insertImport,
} from '../../../utils/ast-utils';
import { addGlobal } from '@nrwl/workspace/src/utilities/ast-utils';
import { addToGitignore, readNxVersion } from '../../../utils/utillities';
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

async function prepareAngularLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const angularProjectName = `${options.projectName}-angular`;
  const { libsDir } = getWorkspaceLayout(host);

  await ensurePackage(host, '@nrwl/angular', readNxVersion(host));
  const generators = await import('@nrwl/angular/generators');
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
  sourceFile = insertImport(
    host,
    sourceFile,
    modulePath,
    'DIRECTIVES',
    '../generated/directives'
  );
  sourceFile = addDeclarationToModule(
    host,
    sourceFile,
    modulePath,
    '...DIRECTIVES'
  );
  sourceFile = addExportToModule(host, sourceFile, modulePath, '...DIRECTIVES');

  sourceFile = insertImport(
    host,
    sourceFile,
    modulePath,
    'defineCustomElements',
    `${getProjectTsImportPath(host, options.projectName)}/loader`
  );

  const changes = applyChangesToString(sourceFile.getFullText(), [
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
