import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  const devDependencies = {
    'solid-jest': '^0.2.0',
    solid: '^1.2.5',
    'solid-testing-library': '^0.2.1',
  };

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
