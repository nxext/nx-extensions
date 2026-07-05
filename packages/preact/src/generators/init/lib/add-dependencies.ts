import { Tree } from '@nx/devkit';
import {
  addFrameworkDependencies,
  FrameworkDependencyMap,
} from '@nxext/common';
import {
  eslintPluginPreactVersion,
  preactVersion,
  testingLibraryPreactVersion,
  vitePluginPreactVersion,
} from '../../utils/versions';

const preactDependencies: FrameworkDependencyMap = {
  dependencies: {},
  devDependencies: {
    preact: preactVersion,
    '@testing-library/preact': testingLibraryPreactVersion,
    '@preact/preset-vite': vitePluginPreactVersion,
    'eslint-plugin-preact': eslintPluginPreactVersion,
  },
};

export function updateDependencies(tree: Tree) {
  return addFrameworkDependencies(tree, preactDependencies);
}
