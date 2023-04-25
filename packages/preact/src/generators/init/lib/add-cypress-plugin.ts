import { Tree, ensurePackage } from '@nx/devkit';
import { readNxVersion } from './util';

export async function addCypressPlugin(host: Tree) {
  await ensurePackage(host, '@nrwl/cypress', readNxVersion(host));
  const { cypressInitGenerator } = await import('@nrwl/cypress');

  return cypressInitGenerator(host, {});
}
