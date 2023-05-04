import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { cypressInitGenerator } from '@nx/cypress';
import { Schema } from '../schema';

export async function addCypressPlugin(
  tree: Tree,
  schema: Schema
): Promise<GeneratorCallback> {
  if (!schema.unitTestRunner || schema.unitTestRunner === 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nrwl/cypress', NX_VERSION);
  return cypressInitGenerator(tree, {});
}
