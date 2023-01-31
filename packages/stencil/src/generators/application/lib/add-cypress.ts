import { ensurePackage, Tree } from '@nrwl/devkit';
import { ApplicationSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addCypress(host: Tree, options: ApplicationSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nrwl/cypress', readNxVersion(host));
  const { cypressProjectGenerator } = await import('@nrwl/cypress');
  return await cypressProjectGenerator(host, {
    ...options,
    name: `${options.name}-e2e`,
    directory: options.directory,
    project: options.name,
  });
}
