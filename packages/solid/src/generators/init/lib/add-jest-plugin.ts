import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addJestPlugin(tree: Tree): Promise<GeneratorCallback> {
  const { jestInitGenerator } = ensurePackage<typeof import('@nx/jest')>(
    '@nx/jest',
    NX_VERSION
  );
  return await jestInitGenerator(tree, {});
}
