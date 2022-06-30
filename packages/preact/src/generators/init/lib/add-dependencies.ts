import { addDependenciesToPackageJson, Tree } from '@nxext/devkit';
import {
  eslintPluginPreactVersion,
  preactVersion,
  testingLibraryPreactVersion,
  vitePluginPreactVersion,
} from '../../utils/versions';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      preact: preactVersion,
      '@testing-library/preact': testingLibraryPreactVersion,
      '@preact/preset-vite': vitePluginPreactVersion,
      'eslint-plugin-preact': eslintPluginPreactVersion,
    }
  );
}
