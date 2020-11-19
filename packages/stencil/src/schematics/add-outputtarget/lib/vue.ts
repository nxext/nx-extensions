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
import { addToGitignore } from '../../../utils/utils';
import { AddOutputtargetSchematicSchema } from '../add-outputtarget';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import * as ts from 'typescript';
import { addToOutputTargets } from '../../../stencil-core-utils';

export function prepareVueLibrary(options: AddOutputtargetSchematicSchema) {
  return (host: Tree) => {
    const vueProjectName = `${options.projectName}-vue`;
    return chain([
      externalSchematic('@nx-plus/vue', 'library', {
        name: vueProjectName,
      }),
      addDepsToPackageJson(
        {},
        {
          '@stencil/vue-output-target': STENCIL_OUTPUTTARGET_VERSION['vue'],
        }
      ),
      (tree) => {
        tree.delete(
          `${libsDir(host)}/${vueProjectName}/tests/unit/example.spec.ts`
        );
        tree.delete(
          `${libsDir(host)}/${vueProjectName}/src/lib/HelloWorld.vue`
        );
        tree.delete(`${libsDir(host)}/${vueProjectName}/src/index.ts`);
        tree.delete(`${libsDir(host)}/${vueProjectName}/src/shims-tsx.d.ts`);
        tree.delete(`${libsDir(host)}/${vueProjectName}/src/shims-vue.d.ts`);
      },
      addToGitignore(`${libsDir(host)}/${vueProjectName}/**/generated`),
    ]);
  };
}

export function addVueOutputtarget(
  tree: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const reactProjectConfig = getProjectConfig(tree, `${projectName}-vue`);
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    reactProjectConfig.root
  );

  insert(tree, stencilConfigPath, [
    insertImport(
      stencilConfigSource,
      stencilConfigPath,
      'vueOutputTarget, ComponentModelConfig',
      '@stencil/vue-output-target'
    ),
    ...addGlobal(
      stencilConfigSource,
      stencilConfigPath,
      'const vueComponentModels: ComponentModelConfig[] = [];'
    ),
    ...addToOutputTargets(
      stencilConfigSource,
      `
          vueOutputTarget({
            componentCorePackage: '${packageName}',
            proxiesFile: '${realtivePath}/src/generated/components.ts',
            componentModels: vueComponentModels,
          })
          `,
      stencilConfigPath
    ),
  ]);
}
