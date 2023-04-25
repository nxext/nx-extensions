import { Tree, ensurePackage } from '@nx/devkit';
import { NormalizedSchema } from '../schema';
import { readNxVersion } from '../../utils/utils';

export async function addCypress(host: Tree, options: NormalizedSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    return () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
  }
  await ensurePackage(host, '@nx/cypress', readNxVersion(host));
  const { cypressProjectGenerator } = await import('@nx/cypress');

  return await cypressProjectGenerator(host, {
    name: options.name + '-e2e',
    project: options.name,
  });
}
