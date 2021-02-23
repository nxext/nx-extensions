import { chain, externalSchematic, Tree } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addGlobal,
  getProjectConfig,
  insert,
  insertImport,
  libsDir
} from '@nrwl/workspace/src/utils/ast-utils';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { getNpmScope } from '@nrwl/workspace';
import { readTsSourceFileFromTree } from '../../../utils/ast-utils';
import { addToGitignore } from '../../../utils/utils';
import { AddOutputtargetSchematicSchema } from '../add-outputtarget';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import * as ts from 'typescript';
import { addToOutputTargets } from '../../../stencil-core-utils';
import { names } from '@nrwl/devkit';

export function prepareAngularLibrary(options: AddOutputtargetSchematicSchema) {
  return (host: Tree) => {
    const angularProjectName = `${options.projectName}-angular`;
    return chain([
      externalSchematic('@nrwl/angular', 'library', {
        name: angularProjectName,
        style: 'css',
        skipPackageJson: !options.publishable,
      }),
      addDepsToPackageJson(
        {},
        {
          '@stencil/angular-output-target':
            STENCIL_OUTPUTTARGET_VERSION['angular'],
        }
      ),
      (tree: Tree) => {
        const angularModuleFilename = names(angularProjectName).fileName;
        const angularModulePath = `${libsDir(
          host
        )}/${angularProjectName}/src/lib/${angularModuleFilename}.module.ts`;
        const angularModuleSource = readTsSourceFileFromTree(
          tree,
          angularModulePath
        );
        const packageName = `@${getNpmScope(tree)}/${options.projectName}`;

        insert(tree, angularModulePath, [
          insertImport(
            angularModuleSource,
            angularModulePath,
            'defineCustomElements',
            `${packageName}/loader`
          ),
          ...addGlobal(
            angularModuleSource,
            angularModulePath,
            'defineCustomElements(window);'
          ),
        ]);
      },
      addToGitignore(`${libsDir(host)}/${angularProjectName}/**/generated`),
    ]);
  };
}

export function addAngularOutputtarget(
  tree: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const angularProjectConfig = getProjectConfig(tree, `${projectName}-angular`);
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    angularProjectConfig.root
  );

  insert(tree, stencilConfigPath, [
    insertImport(
      stencilConfigSource,
      stencilConfigPath,
      'angularOutputTarget, ValueAccessorConfig',
      '@stencil/angular-output-target'
    ),
    ...addGlobal(
      stencilConfigSource,
      stencilConfigPath,
      'const angularValueAccessorBindings: ValueAccessorConfig[] = [];'
    ),
    ...addToOutputTargets(
      stencilConfigSource,
      `
          angularOutputTarget({
              componentCorePackage: '${packageName}',
              directivesProxyFile: '${realtivePath}/src/generated/directives/proxies.ts',
              valueAccessorConfigs: angularValueAccessorBindings
            }),
          `,
      stencilConfigPath
    ),
  ]);
}
