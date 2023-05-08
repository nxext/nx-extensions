import { jestInitGenerator } from '@nx/jest';
import { GeneratorCallback, Tree, ensurePackage, NX_VERSION } from '@nx/devkit';

export async function addJestPlugin(
  tree: Tree,
  options
): Promise<GeneratorCallback> {
  if (options.unitTestRunner !== 'jest') {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
  ensurePackage('@nx/jest', NX_VERSION);
  const { jestInitGenerator } = await import('@nx/jest');
  const jestTask = await jestInitGenerator(tree, {});

  return jestTask;
}
