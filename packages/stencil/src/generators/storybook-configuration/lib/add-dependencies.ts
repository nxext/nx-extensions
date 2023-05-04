import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import { storybookVersion } from '@nx/storybook';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      '@storybook/manager-webpack5': storybookVersion,
      '@storybook/builder-webpack5': storybookVersion,
      '@storybook/web-components': storybookVersion,
      'lit-html': '^2.4.0',
    }
  );
}
