import { ensurePackage, GeneratorCallback, NX_VERSION, Tree } from '@nx/devkit';

export async function addLinterPlugin(tree: Tree): Promise<GeneratorCallback> {
  ensurePackage('@nrwl/linter', NX_VERSION);
  const { lintInitGenerator } = await import('@nrwl/linter');

  return lintInitGenerator(tree, {});
}
