import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addJestPlugin(tree: Tree): Promise<GeneratorCallback> {
  ensurePackage('@nx/jest', NX_VERSION);
  const { jestInitGenerator } = await import('@nx/jest');
  return await jestInitGenerator(tree, {});
}
