import { ensurePackage, Tree } from '@nx/devkit';
import { InitSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addJest(host: Tree, options: InitSchema) {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nx/jest', readNxVersion(host));
  const { jestInitGenerator } = await import('@nx/jest');

  return jestInitGenerator(host, {});
}
