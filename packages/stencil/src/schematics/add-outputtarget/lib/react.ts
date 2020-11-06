import { chain, externalSchematic, Tree } from '@angular-devkit/schematics';
import { Schema as ReactLibrarySchema } from '@nrwl/react/src/schematics/library/schema';
import {
  addDepsToPackageJson,
  getProjectConfig,
  insert,
  insertImport,
  libsDir
} from '@nrwl/workspace/src/utils/ast-utils';
import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addToGitignore } from '../../../utils/utils';
import { AddOutputtargetSchematicSchema } from '../add-outputtarget';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import { addToOutputTargets } from './add-to-outputargets';
import * as ts from 'typescript';

export function prepareReactLibrary(options: AddOutputtargetSchematicSchema) {
  return (host: Tree) => {
    const reactProjectName = `${options.projectName}-react`;
    return chain([
      externalSchematic('@nrwl/react', 'library', {
        name: reactProjectName,
        style: 'css',
        publishable: options.publishable,
      } as ReactLibrarySchema),
      addDepsToPackageJson(
        {},
        {
          '@stencil/react-output-target': STENCIL_OUTPUTTARGET_VERSION['react'],
        }
      ),
      (tree) => {
        tree.delete(
          `${libsDir(host)}/${reactProjectName}/src/lib/${
            options.projectName
          }-react.tsx`
        );
        tree.delete(
          `${libsDir(host)}/${reactProjectName}/src/lib/${
            options.projectName
          }-react.spec.tsx`
        );
        tree.delete(
          `${libsDir(host)}/${reactProjectName}/src/lib/${
            options.projectName
          }-react.css`
        );

        tree.overwrite(
          `${libsDir(host)}/${reactProjectName}/src/index.ts`,
          `export * from './generated/components';`
        );
      },
      addToGitignore(`${libsDir(host)}/${reactProjectName}/**/generated`),
    ]);
  };
}

export function addReactOutputtarget(tree: Tree, projectName: string, stencilProjectConfig, stencilConfigPath: string, stencilConfigSource: ts.SourceFile, packageName: string) {
  const reactProjectConfig = getProjectConfig(tree, `${projectName}-react`);
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    reactProjectConfig.root
  );

  insert(tree, stencilConfigPath, [
    insertImport(
      stencilConfigSource,
      stencilConfigPath,
      'reactOutputTarget',
      '@stencil/react-output-target'
    ),
    ...addToOutputTargets(
      stencilConfigSource,
      `
          reactOutputTarget({
            componentCorePackage: '${packageName}',
            proxiesFile: '${realtivePath}/src/generated/components.ts',
          })
          `,
      stencilConfigPath
    )
  ]);
}
