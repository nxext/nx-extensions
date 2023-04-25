import { Tree, ensurePackage } from '@nx/devkit';
import { readNxVersion } from './util';

export async function addCypressPlugin(host: Tree) {
  await ensurePackage(host, '@nx/cypress', readNxVersion(host));
  const { cypressInitGenerator } = await import('@nx/cypress');

  return cypressInitGenerator(host, {});
}
