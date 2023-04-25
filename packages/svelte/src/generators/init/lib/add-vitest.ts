import { GeneratorCallback, Tree } from '@nx/devkit';
import { vitestInitGenerator } from '@nxext/vitest';
import { Schema } from '../schema';

export function addVitestPlugin(tree: Tree, schema: Schema): GeneratorCallback {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'vitest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return vitestInitGenerator(tree, {});
}
