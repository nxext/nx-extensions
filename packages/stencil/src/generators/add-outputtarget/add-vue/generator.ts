import {
  addDependenciesToPackageJson,
  applyChangesToString,
  ensurePackage,
  getWorkspaceLayout,
  NX_VERSION,
  readProjectConfiguration,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import { initGenerator as jsInitGenerator } from '@nx/js';
import { AddOutputtargetSchematicSchema } from '../schema';
import { Linter } from '@nx/eslint';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import * as ts from 'typescript';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import { addImport } from '@nxext/common';
import { addOutputTarget } from '../../../stencil-core-utils';
import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';

async function prepareVueLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const { libsDir } = getWorkspaceLayout(host);
  const vueProjectName = `${options.projectName}-vue`;
  const vueProjectDir = `libs/${vueProjectName}`;

  const jsInitTask = await jsInitGenerator(host, {
    ...options,
    tsConfigName: 'tsconfig.base.json',
    skipFormat: true,
  });

  ensurePackage('@nx/vue', NX_VERSION);
  const { libraryGenerator } = await import('@nx/vue');
  const libraryTarget = await libraryGenerator(host, {
    directory: vueProjectDir,
    publishable: options.publishable,
    bundler: options.publishable ? 'vite' : 'none',
    importPath: options.importPath,
    component: false,
    skipTsConfig: false,
    skipFormat: true,
    unitTestRunner: 'vitest',
    linter: Linter.EsLint,
  });

  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/vue-output-target': STENCIL_OUTPUTTARGET_VERSION['vue'],
    }
  );

  host.write(
    `${libsDir}/${vueProjectName}/src/index.ts`,
    `export * from './generated/components';`
  );

  return runTasksInSerial(jsInitTask, libraryTarget);
}

function addVueOutputtarget(
  tree: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const vueProjectConfig = readProjectConfiguration(tree, `${projectName}-vue`);
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    vueProjectConfig.root
  );

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(
      stencilConfigSource,
      `import { vueOutputTarget } from '@stencil/vue-output-target';`
    ),
    ...addOutputTarget(
      stencilConfigSource,
      `
      vueOutputTarget({
        componentCorePackage: '${packageName}',
        proxiesFile: '${realtivePath}/src/generated/components.ts',
        includeDefineCustomElements: true,
      })
      `
    ),
  ]);
  tree.write(stencilConfigPath, changes);
}

export async function addVueGenerator(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const libraryTarget = await prepareVueLibrary(host, options);

  const {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  } = calculateStencilSourceOptions(host, options.projectName);

  addVueOutputtarget(
    host,
    options.projectName,
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName
  );

  return libraryTarget;
}

export default addVueGenerator;
