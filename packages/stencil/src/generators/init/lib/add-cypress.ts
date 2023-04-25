import { ensurePackage, Tree } from '@nx/devkit';
import { InitSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addCypress(host: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nx/cypress', readNxVersion(host));
  const generators = await import('@nx/cypress');
  return generators.cypressInitGenerator(host, {});
}
