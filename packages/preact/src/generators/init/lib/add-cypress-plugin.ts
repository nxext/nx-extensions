import { Tree } from '@nx/devkit';
import { addCypressInitPlugin } from '@nxext/common';
import { Schema } from '../schema';

export async function addCypressPlugin(host: Tree, options: Schema) {
  return addCypressInitPlugin(host, () => options.e2eTestRunner === 'cypress');
}
