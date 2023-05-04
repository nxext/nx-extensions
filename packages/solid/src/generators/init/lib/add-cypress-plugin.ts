import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addCypressPlugin(tree: Tree): Promise<GeneratorCallback> {
  ensurePackage('@nx/cypress', NX_VERSION);
  const { cypressInitGenerator } = await import('@nx/cypress');
  return await cypressInitGenerator(tree, {});
}
