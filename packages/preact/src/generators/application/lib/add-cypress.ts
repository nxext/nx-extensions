import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
  const { cypressProjectGenerator } = ensurePackage<
    typeof import('@nx/cypress')
  >('@nx/cypress', NX_VERSION);

  return await cypressProjectGenerator(host, {
    name: options.name + '-e2e',
    project: options.name,
  });
}
