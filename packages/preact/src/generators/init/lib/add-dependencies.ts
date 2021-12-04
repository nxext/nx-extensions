import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  const devDependencies = {
    preact: '^10.6.2',
    vite: '^2.5.7',
    '@testing-library/preact': '^2.0.1',
    '@preact/preset-vite': '^2.1.5',
  };

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
