import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { ApplicationSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addCypress(host: Tree, options: ApplicationSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nx/cypress', NX_VERSION);
  const { cypressProjectGenerator } = await import('@nx/cypress');
  return await cypressProjectGenerator(host, {
    ...options,
    name: `${options.name}-e2e`,
    directory: options.directory,
    project: options.name,
  });
}
