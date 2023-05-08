import { GeneratorCallback, Tree } from '@nx/devkit';
import { vitestInitGenerator } from '@nxext/vitest';

export function addVitestPlugin(tree: Tree, options): GeneratorCallback {
  if (options.unitTestRunner === 'vitest') {
    return vitestInitGenerator(tree, {});
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }
}
