import {
  addDependenciesToPackageJson,
  applyChangesToString, convertNxGenerator,
  getWorkspaceLayout, joinPathFragments,
  names, readProjectConfiguration,
  Tree
} from '@nrwl/devkit';
import { AddOutputtargetSchematicSchema } from '../schema';
import { libraryGenerator } from '@nrwl/angular/generators';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addImport, readTsSourceFile } from '../../../utils/ast-utils';
import { addGlobal } from '@nrwl/workspace/src/utilities/ast-utils';
import { addToGitignore } from '../../../utils/utillities';
import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial';
import * as ts from 'typescript';
import { relative } from 'path';
import { getDistDir } from '../../../utils/fileutils';
import { addOutputTarget } from '../../../stencil-core-utils';

async function prepareAngularLibrary(host: Tree, options: AddOutputtargetSchematicSchema) {
  const angularProjectName = `${options.projectName}-angular`;
  const { libsDir, npmScope } = getWorkspaceLayout(host);

  const libraryTarget = await libraryGenerator(host, {
    name: angularProjectName,
    skipFormat: true,
    publishable: options.publishable
  });

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/angular-output-target':
        STENCIL_OUTPUTTARGET_VERSION['angular']
    }
  );

  const angularModuleFilename = names(angularProjectName).fileName;
  const angularModulePath = `${libsDir}/${angularProjectName}/src/lib/${angularModuleFilename}.module.ts`;
  const angularModuleSource = readTsSourceFile(
    host,
    angularModulePath
  );
  const packageName = `@${npmScope}/${options.projectName}`;

  const changes = applyChangesToString(angularModuleSource.text, [
    ...addImport(angularModuleSource, `import { defineCustomElements } from '${packageName}/loader';`),
  ]);
  host.write(angularModulePath, changes);

  addGlobal(host, angularModuleSource, angularModulePath, 'defineCustomElements(window);');

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
  const angularProjectConfig = readProjectConfiguration(host, `${projectName}-angular`);
  const realtivePath = relative(
    getDistDir(stencilProjectConfig.root),
    angularProjectConfig.root
  );
  const proxyPath = joinPathFragments(realtivePath, 'src/generated/directives/proxies.ts');

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(stencilConfigSource, `import { angularOutputTarget, ValueAccessorConfig } from '@stencil/angular-output-target';`),
    ...addOutputTarget(
      stencilConfigSource,
      `
      angularOutputTarget({
          componentCorePackage: '${packageName}',
          directivesProxyFile: '${proxyPath}',
          valueAccessorConfigs: angularValueAccessorBindings
        }),
      `
    )
  ]);
  host.write(stencilConfigPath, changes);

  addGlobal(
    host,
    stencilConfigSource,
    stencilConfigPath,
    'const angularValueAccessorBindings: ValueAccessorConfig[] = [];'
  );
}

export async function addAngularGenerator(host: Tree, options: AddOutputtargetSchematicSchema) {
  const libraryTarget = await prepareAngularLibrary(host, options);

  const { stencilProjectConfig, stencilConfigPath, stencilConfigSource, packageName } = calculateStencilSourceOptions(host, options.projectName);

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
