import { Tree } from '@nx/devkit';
import { addJestInitPlugin } from '@nxext/common';
import { Schema } from '../schema';

export async function addJestPlugin(host: Tree, options: Schema) {
  return addJestInitPlugin(host, () => options.unitTestRunner === 'jest');
}
