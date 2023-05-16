import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addCypressPlugin(tree: Tree): Promise<GeneratorCallback> {
  const { cypressInitGenerator } = ensurePackage<typeof import('@nx/cypress')>(
    '@nx/cypress',
    NX_VERSION
  );
  return await cypressInitGenerator(tree, {});
}
