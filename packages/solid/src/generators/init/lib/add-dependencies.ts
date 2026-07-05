import { Tree } from '@nx/devkit';
import { addFrameworkDependencies } from '@nxext/common';
import {
  eslintPluginSolidVersion,
  solidJestVersion,
  solidTestingLibraryVersion,
  solidVersion,
  vitePluginSolidVersion,
} from '../../utils/versions';

export function updateDependencies(tree: Tree) {
  return addFrameworkDependencies(tree, {
    dependencies: {},
    devDependencies: {
      'solid-jest': solidJestVersion,
      'solid-js': solidVersion,
      '@solidjs/testing-library': solidTestingLibraryVersion,
      'eslint-plugin-solid': eslintPluginSolidVersion,
      'vite-plugin-solid': vitePluginSolidVersion,
    },
  });
}
