import { ensurePackage, Tree } from '@nrwl/devkit';
import { InitSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addCypress(host: Tree, options: InitSchema) {
  if (options.e2eTestRunner !== 'cypress') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nrwl/cypress', readNxVersion(host));
  const generators = await import('@nrwl/cypress');
  return generators.cypressInitGenerator(host, {});
}
