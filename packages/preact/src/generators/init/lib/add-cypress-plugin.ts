import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { Schema } from '../schema';

export async function addCypressPlugin(host: Tree, options: Schema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  const { cypressInitGenerator } = ensurePackage<typeof import('@nx/cypress')>(
    '@nx/cypress',
    NX_VERSION
  );

  return cypressInitGenerator(host, {});
}
