import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export const preactVersion = '^10.6.2';
export const testingLibraryPreactVersion = '^2.0.1';
export const vitePluginPreactVersion = '^2.1.5';
export const eslintPluginPreactVersion = '^0.1.0';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(tree, {}, {
    preact: preactVersion,
    '@testing-library/preact': testingLibraryPreactVersion,
    '@preact/preset-vite': vitePluginPreactVersion,
    'eslint-plugin-preact': eslintPluginPreactVersion,
  });
}
