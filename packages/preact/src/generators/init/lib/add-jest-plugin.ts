import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addJestPlugin(host: Tree) {
  await ensurePackage(host, '@nx/jest', NX_VERSION);
  const { jestInitGenerator } = await import('@nx/jest');

  return await jestInitGenerator(host, {});
}
