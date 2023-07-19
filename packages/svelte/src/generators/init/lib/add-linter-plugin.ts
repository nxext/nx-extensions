import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

export async function addLinterPlugin(tree: Tree): Promise<GeneratorCallback> {
  ensurePackage('@nx/linter', NX_VERSION);
  const { lintInitGenerator } = await import('@nx/linter');

  return lintInitGenerator(tree, {});
}
