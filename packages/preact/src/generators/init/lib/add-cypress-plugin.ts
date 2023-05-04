import { Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addCypressPlugin(host: Tree) {
  await ensurePackage(host, '@nx/cypress', NX_VERSION);
  const { cypressInitGenerator } = await import('@nx/cypress');

  return cypressInitGenerator(host, {});
}
