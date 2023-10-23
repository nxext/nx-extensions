import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

export async function addLinterPlugin(tree: Tree): Promise<GeneratorCallback> {
  ensurePackage('@nx/eslint', NX_VERSION);
  const { lintInitGenerator } = await import('@nx/eslint');

  return lintInitGenerator(tree, {});
}
