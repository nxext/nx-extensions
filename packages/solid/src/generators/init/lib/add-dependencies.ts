import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  eslintPluginSolidVersion,
  solidJestVersion,
  solidTestingLibraryVersion,
  solidVersion,
  vitePluginSolidVersion,
} from '../../utils/versions';
import { Schema } from '../schema';

export function updateDependencies(tree: Tree, schema: Schema) {
  let devDependencies: Record<string, string> = {
    'solid-js': solidVersion,
    'solid-testing-library': solidTestingLibraryVersion,
    'eslint-plugin-solid': eslintPluginSolidVersion,
    'vite-plugin-solid': vitePluginSolidVersion,
  };

  if (schema.unitTestRunner === 'jest') {
    devDependencies = {
      ...devDependencies,
      'solid-jest': solidJestVersion,
      '@testing-library/jest-dom': '5.16.5',
    };
  }

  return addDependenciesToPackageJson(tree, {}, devDependencies);
}
