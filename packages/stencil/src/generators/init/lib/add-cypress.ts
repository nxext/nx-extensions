import { Tree } from '@nxext/devkit';
import { InitSchema } from '../schema';

export async function addCypress(host: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  const generators = await import('@nrwl/cypress');
  return generators.cypressInitGenerator(host, {});
}
