import { cypressProjectGenerator } from '@nrwl/cypress';
import { Tree } from '@nxext/devkit';
import { NormalizedSchema } from '../schema';

export async function addCypress(tree: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }

  return await cypressProjectGenerator(tree, {
    name: options.name + '-e2e',
    project: options.name,
  });
}
