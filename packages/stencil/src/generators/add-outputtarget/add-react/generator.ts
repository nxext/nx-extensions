import {
  addDependenciesToPackageJson,
  applyChangesToString,
  convertNxGenerator,
  ensurePackage,
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { Linter } from '@nrwl/linter';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addToGitignore, readNxVersion } from '../../../utils/utillities';
import * as ts from 'typescript';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import { addImport } from '../../../utils/ast-utils';
import { addOutputTarget } from '../../../stencil-core-utils';
import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';

async function prepareReactLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const { libsDir } = getWorkspaceLayout(host);
  const reactProjectName = `${options.projectName}-react`;

  await ensurePackage(host, '@nrwl/react', readNxVersion(host));
  const { libraryGenerator } = await import('@nrwl/react');
  const libraryTarget = await libraryGenerator(host, {
    name: reactProjectName,
    style: 'css',
    publishable: options.publishable,
    importPath: options.importPath,
    component: false,
    skipTsConfig: false,
    skipFormat: true,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
  });

  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/react-output-target': STENCIL_OUTPUTTARGET_VERSION['react'],
    }
  );

  host.write(
    `${libsDir}/${reactProjectName}/src/index.ts`,
    `export * from './generated/components';`
  );

  addToGitignore(host, `${libsDir}/${reactProjectName}/**/generated`);

  return libraryTarget;
}

function addReactOutputtarget(
  tree: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const reactProjectConfig = readProjectConfiguration(
    tree,
    `${projectName}-react`
  );
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    reactProjectConfig.root
  );

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(
      stencilConfigSource,
      `import { reactOutputTarget } from '@stencil/react-output-target';`
    ),
    ...addOutputTarget(
      stencilConfigSource,
      `
      reactOutputTarget({
        componentCorePackage: '${packageName}',
        proxiesFile: '${realtivePath}/src/generated/components.ts',
        includeDefineCustomElements: true,
      })
      `
    ),
  ]);
  tree.write(stencilConfigPath, changes);
}

export async function addReactGenerator(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const libraryTarget = await prepareReactLibrary(host, options);

  const {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  } = calculateStencilSourceOptions(host, options.projectName);

  addReactOutputtarget(
    host,
    options.projectName,
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName
  );

  return libraryTarget;
}

export default addReactGenerator;
export const addReactSchematic = convertNxGenerator(addReactGenerator);
