import { cypressProjectGenerator } from '@nrwl/cypress';
import { Tree } from '@nrwl/devkit';
import { ApplicationSchema } from '../schema';

export async function addCypress(host: Tree, options: ApplicationSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  return await cypressProjectGenerator(host, {
    ...options,
    name: `${options.name}-e2e`,
    directory: options.directory,
    project: options.name,
  });
}
