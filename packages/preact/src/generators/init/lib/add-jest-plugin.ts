import { Tree, ensurePackage } from '@nx/devkit';
import { readNxVersion } from './util';

export async function addJestPlugin(host: Tree) {
  await ensurePackage(host, '@nrwl/jest', readNxVersion(host));
  const { jestInitGenerator } = await import('@nrwl/jest');

  return await jestInitGenerator(host, {});
}
