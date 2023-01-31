import { ensurePackage, Tree } from '@nrwl/devkit';
import { InitSchema } from '../schema';
import { readNxVersion } from '../../../utils/utillities';

export async function addJest(host: Tree, options: InitSchema) {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage(host, '@nrwl/jest', readNxVersion(host));
  const { jestInitGenerator } = await import('@nrwl/jest');

  return jestInitGenerator(host, {});
}
