import { Tree, ensurePackage } from '@nx/devkit';
import { readNxVersion } from './util';

export async function addJestPlugin(host: Tree) {
  await ensurePackage(host, '@nx/jest', readNxVersion(host));
  const { jestInitGenerator } = await import('@nx/jest');

  return await jestInitGenerator(host, {});
}
