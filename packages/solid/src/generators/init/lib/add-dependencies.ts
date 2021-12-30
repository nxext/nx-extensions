import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  eslintPluginSolidVersion,
  solidJestVersion,
  solidTestingLibraryVersion,
  solidVersion, vitePluginSolidVersion
} from '../../utils/versions';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'solid-jest': solidJestVersion,
      'solid-js': solidVersion,
      'solid-testing-library': solidTestingLibraryVersion,
      vite: '^2.5.7',
      'eslint-plugin-solid': eslintPluginSolidVersion,
      'vite-plugin-solid': vitePluginSolidVersion
    }
  );
}
