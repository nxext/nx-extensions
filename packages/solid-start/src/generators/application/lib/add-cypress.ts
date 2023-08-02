import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export async function addCypress(tree: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  const { cypressProjectGenerator } = ensurePackage<
    typeof import('@nx/cypress')
  >('@nx/cypress', NX_VERSION);

  return await cypressProjectGenerator(tree, {
    name: options.name + '-e2e',
    project: options.name,
  });
}
