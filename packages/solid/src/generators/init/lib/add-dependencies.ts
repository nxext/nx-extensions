import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  const devDependencies = {
    'solid-jest': '^0.2.0',
    'solid-js': '^1.2.5',
    'solid-testing-library': '^0.2.1',
    'vite-plugin-solid': '2.1.2',
    'eslint-plugin-solid': '0.1.2',
  };

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
