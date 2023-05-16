import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { Schema } from '../schema';

export async function addJestPlugin(host: Tree, options: Schema) {
  if (options.unitTestRunner !== 'jest') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { jestInitGenerator } = ensurePackage<typeof import('@nx/jest')>(
    '@nx/jest',
    NX_VERSION
  );

  return await jestInitGenerator(host, {});
}
