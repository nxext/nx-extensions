import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
import { addToGitignore } from '../../../utils/utillities';
import { getDistDir, getRelativePath } from '../../../utils/fileutils';
import * as ts from 'typescript';
import { addToOutputTargets } from '../../../stencil-core-utils';
import { AddOutputtargetSchematicSchema } from '../schema';
import {
  addDependenciesToPackageJson, applyChangesToString,
  getWorkspaceLayout,
  joinPathFragments,
  readProjectConfiguration,
  Tree
} from '@nrwl/devkit';
import { libraryGenerator } from '@nx-plus/vue';
import { addImport } from '../../../utils/ast-utils';
import { addGlobal } from '@nrwl/workspace/src/utilities/ast-utils';

export async function prepareVueLibrary(host: Tree, options: AddOutputtargetSchematicSchema) {
  const vueProjectName = `${options.projectName}-vue`;
  const { libsDir } = getWorkspaceLayout(host);

  await libraryGenerator(host, {
    name: vueProjectName
  });

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@stencil/vue-output-target': STENCIL_OUTPUTTARGET_VERSION['vue']
    }
  );

  host.delete(`${libsDir}/${vueProjectName}/tests/unit/example.spec.ts`);
  host.delete(`${libsDir}/${vueProjectName}/src/lib/HelloWorld.vue`);
  host.delete(`${libsDir}/${vueProjectName}/src/index.ts`);
  host.delete(`${libsDir}/${vueProjectName}/src/shims-tsx.d.ts`);
  host.delete(`${libsDir}/${vueProjectName}/src/shims-vue.d.ts`);

  addToGitignore(host, `${libsDir}/${vueProjectName}/**/generated`);
}

export function addVueOutputtarget(
  host: Tree,
  projectName: string,
  stencilProjectConfig,
  stencilConfigPath: string,
  stencilConfigSource: ts.SourceFile,
  packageName: string
) {
  const reactProjectConfig = readProjectConfiguration(host, `${projectName}-vue`);
  const realtivePath = getRelativePath(
    getDistDir(stencilProjectConfig.root),
    reactProjectConfig.root
  );
  const proxyPath = joinPathFragments(realtivePath, 'src/generated/components.ts')

  const changes = applyChangesToString(stencilConfigSource.text, [
    ...addImport(stencilConfigSource, `import { vueOutputTarget, ComponentModelConfig } from '@stencil/vue-output-target';`),
    ...addToOutputTargets(
      stencilConfigSource,
  `
      vueOutputTarget({
        componentCorePackage: '${packageName}',
        proxiesFile: '${proxyPath}',
        componentModels: vueComponentModels,
      })
      `
    )
  ]);
  host.write(stencilConfigPath, changes);

  addGlobal(host, stencilConfigSource, stencilConfigPath, 'const vueComponentModels: ComponentModelConfig[] = [];');
}
