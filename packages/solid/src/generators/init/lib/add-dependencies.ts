import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  const devDependencies = {
    'solid-jest': '^0.2.0',
    'solid-js': '^1.2.5',
    'solid-testing-library': '^0.2.1',
    vite: '^2.5.7',
    'eslint-plugin-solid': '0.1.2',
  };

  return addDependenciesToPackageJson(
    tree,
    { 'vite-plugin-solid': '2.1.2' },
    devDependencies
  );
}
