import { cypressInitGenerator, cypressProjectGenerator } from '@nrwl/cypress';
import { Tree } from '@nrwl/devkit';
import { InitSchema } from '../schema';

export async function addCypress(host: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return cypressInitGenerator(host);
}
