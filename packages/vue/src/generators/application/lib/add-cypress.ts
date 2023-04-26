import { ensurePackage, Tree } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { readNxVersion } from '../../utils/utils';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nx/cypress', readNxVersion(host));
  const { cypressProjectGenerator } = await import('@nx/cypress');
  return await cypressProjectGenerator(host, {
    ...options,
    name: options.e2eProjectName,
    directory: options.directory,
    project: options.appProjectName,
    bundler: 'vite',
  });
}
