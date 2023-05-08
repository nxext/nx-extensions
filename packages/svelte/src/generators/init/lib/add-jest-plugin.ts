import { jestInitGenerator } from '@nx/jest';
import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { Schema } from '../schema';

export async function addJestPlugin(
  tree: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nrwl/jest', NX_VERSION);

  return await jestInitGenerator(tree, {});
}
