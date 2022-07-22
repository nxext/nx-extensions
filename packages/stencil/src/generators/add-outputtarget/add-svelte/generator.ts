import {
  addDependenciesToPackageJson,
  applyChangesToString,
  convertNxGenerator,
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { Linter } from '@nrwl/linter';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addToGitignore } from '../../../utils/utillities';
import * as ts from 'typescript';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import { addImport } from '../../../utils/ast-utils';
import { addOutputTarget } from '../../../stencil-core-utils';
import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';

async function prepareSvelteLibrary(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const { libsDir } = getWorkspaceLayout(host);
  const svelteProjectName = `${options.projectName}-svelte`;

  const generators = await import('@nxext/svelte');
  const libraryTarget = await generators.libraryGenerator(host, {
    name: svelteProjectName,
    publishable: options.publishable,
    importPath: options.importPath,
    unitTestRunner: 'jest',
    e2eTestRunner: 'none',
    linter: Linter.EsLint,
    skipFormat: true,
  });

  await addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/svelte-output-target': STENCIL_OUTPUTTARGET_VERSION['svelte'],
    }
  );

  host.write(
    `${libsDir}/${svelteProjectName}/src/index.ts`,
    `export * from './generated/components';`
  );

  addToGitignore(host, `${libsDir}/${svelteProjectName}/**/generated`);

  return libraryTarget;
}

function addSvelteOutputtarget(
  tree: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const svelteProjectConfig = readProjectConfiguration(
    tree,
    `${projectName}-svelte`
  );
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    svelteProjectConfig.root
  );

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(
      stencilConfigSource,
      `import { svelteOutputTarget } from '@stencil/svelte-output-target';`
    ),
    ...addOutputTarget(
      stencilConfigSource,
      `
      svelteOutputTarget({
        componentCorePackage: '${packageName}',
        proxiesFile: '${realtivePath}/src/generated/components.ts',
        includeDefineCustomElements: true,
      })
      `
    ),
  ]);
  tree.write(stencilConfigPath, changes);
}

export async function addSvelteGenerator(
  host: Tree,
  options: AddOutputtargetSchematicSchema
) {
  const libraryTarget = await prepareSvelteLibrary(host, options);

  const {
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName,
  } = calculateStencilSourceOptions(host, options.projectName);

  addSvelteOutputtarget(
    host,
    options.projectName,
    stencilProjectConfig,
    stencilConfigPath,
    stencilConfigSource,
    packageName
  );

  return libraryTarget;
}

export default addSvelteGenerator;
export const addSvelteSchematic = convertNxGenerator(addSvelteGenerator);
