import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addImport, readTsSourceFile } from '../../../utils/ast-utils';
import { addToGitignore } from '../../../utils/utils';
import { getDistDir } from '../../../utils/fileutils';
import * as ts from 'typescript';
import {
  addDependenciesToPackageJson,
  applyChangesToString,
  getWorkspaceLayout,
  names,
  readProjectConfiguration,
  Tree,
  joinPathFragments
} from '@nrwl/devkit';
import { relative } from 'path';
import { AddOutputtargetSchematicSchema } from '../schema';
import { libraryGenerator } from '@nrwl/angular/generators';
import { addGlobal } from '@nrwl/workspace/src/utilities/ast-utils';
import { addToOutputTargets } from '../../../stencil-core-utils/lib/devkit/plugins';

export async function prepareAngularLibrary(host: Tree, options: AddOutputtargetSchematicSchema) {
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

  addToGitignore(`${libsDir}/${angularProjectName}/**/generated`);

  return libraryTarget;
}

export function addAngularOutputtarget(
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
    ...addToOutputTargets(
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
