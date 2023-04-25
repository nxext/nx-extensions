// import {
//   addDependenciesToPackageJson,
//   applyChangesToString,
//   convertNxGenerator,
//   getWorkspaceLayout,
//   joinPathFragments,
//   readProjectConfiguration,
// } from '@nx/devkit';
// import type { GeneratorCallback, Tree } from '@nx/devkit';
// import { AddOutputtargetSchematicSchema } from '../schema';
// import { STENCIL_OUTPUTTARGET_VERSION } from '../../../utils/versions';
// import { addToGitignore } from '../../../utils/utillities';
// import * as ts from 'typescript';
// import { getDistDir, getRelativePath } from '../../../utils/fileutils';
// import { addImport } from '../../../utils/ast-utils';
// import { addOutputTarget } from '../../../stencil-core-utils';
// import { addGlobal } from '@nx/workspace/src/utilities/ast-utils';
// import { calculateStencilSourceOptions } from '../lib/calculate-stencil-source-options';
//
// export async function prepareVueLibrary(
//   host: Tree,
//   options: AddOutputtargetSchematicSchema
// ): Promise<GeneratorCallback> {
//   const vueProjectName = `${options.projectName}-vue`;
//   const { libsDir } = getWorkspaceLayout(host);
//
//   const generators = await import('@nx-plus/vue');
//   const libraryTarget = await generators.libraryGenerator(host, {
//     name: vueProjectName,
//     publishable: options.publishable,
//     vueVersion: 3,
//     unitTestRunner: 'jest',
//     skipTsConfig: false,
//     skipFormat: false,
//     babel: false,
//   });
//
//   addDependenciesToPackageJson(
//     host,
//     {},
//     {
//       '@stencil/vue-output-target': STENCIL_OUTPUTTARGET_VERSION['vue'],
//     }
//   );
//
//   host.delete(`${libsDir}/${vueProjectName}/tests/unit/example.spec.ts`);
//   host.delete(`${libsDir}/${vueProjectName}/src/lib/HelloWorld.vue`);
//   host.delete(`${libsDir}/${vueProjectName}/src/index.ts`);
//   host.delete(`${libsDir}/${vueProjectName}/src/shims-tsx.d.ts`);
//   host.delete(`${libsDir}/${vueProjectName}/src/shims-vue.d.ts`);
//
//   addToGitignore(host, `${libsDir}/${vueProjectName}/**/generated`);
//
//   return libraryTarget;
// }
//
// function addVueOutputtarget(
//   host: Tree,
//   projectName: string,
//   stencilProjectConfig,
//   stencilConfigPath: string,
//   stencilConfigSource: ts.SourceFile,
//   packageName: string
// ) {
//   const reactProjectConfig = readProjectConfiguration(
//     host,
//     `${projectName}-vue`
//   );
//   const realtivePath = getRelativePath(
//     getDistDir(stencilProjectConfig.root),
//     reactProjectConfig.root
//   );
//   const proxyPath = joinPathFragments(
//     realtivePath,
//     'src/generated/components.ts'
//   );
//
//   const changes = applyChangesToString(stencilConfigSource.text, [
//     ...addImport(
//       stencilConfigSource,
//       `import { vueOutputTarget, ComponentModelConfig } from '@stencil/vue-output-target';`
//     ),
//     ...addOutputTarget(
//       stencilConfigSource,
//       `
//       vueOutputTarget({
//         componentCorePackage: '${packageName}',
//         proxiesFile: '${proxyPath}',
//         componentModels: vueComponentModels,
//       })
//       `
//     ),
//   ]);
//   host.write(stencilConfigPath, changes);
//
//   addGlobal(
//     host,
//     stencilConfigSource,
//     stencilConfigPath,
//     'const vueComponentModels: ComponentModelConfig[] = [];'
//   );
// }
//
// export async function addVueGenerator(
//   host: Tree,
//   options: AddOutputtargetSchematicSchema
// ) {
//   const libraryTarget = await prepareVueLibrary(host, options);
//
//   const {
//     stencilProjectConfig,
//     stencilConfigPath,
//     stencilConfigSource,
//     packageName,
//   } = calculateStencilSourceOptions(host, options.projectName);
//
//   addVueOutputtarget(
//     host,
//     options.projectName,
//     stencilProjectConfig,
//     stencilConfigPath,
//     stencilConfigSource,
//     packageName
//   );
//
//   return libraryTarget;
// }
//
// export default addVueGenerator;
// export const addVueSchematic = convertNxGenerator(addVueGenerator);
