import { addDependenciesToPackageJson, Tree } from '@nxext/devkit';
import { storybookVersion } from '@nrwl/storybook';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@storybook/manager-webpack5': storybookVersion,
      '@storybook/builder-webpack5': storybookVersion,
    }
  );
}
