import { ensurePackage, NX_VERSION, Tree } from '@nx/devkit';
import { InitSchema } from '../schema';

export async function addJest(host: Tree, options: InitSchema) {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }

  await ensurePackage('@nx/jest', NX_VERSION);
  const { jestInitGenerator } = await import('@nx/jest');

  return jestInitGenerator(host, {});
}
