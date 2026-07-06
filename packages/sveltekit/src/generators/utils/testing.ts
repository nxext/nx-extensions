import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { applicationGenerator } from '../application/generator';

export async function createTestProject(
  name: string,
  unitTestrunner: 'none' | 'vitest' = 'none',
  // Same pattern as @nxext/svelte's utils/testing.ts: pass
  // `createTsSolutionTree()` (from @nxext/common) here to scaffold the test
  // project into a TS-solution workspace instead of the default legacy one.
  tree: Tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' })
): Promise<Tree> {
  tree.write(
    'package.json',
    `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nx/workspace": "0.0.0"
        }
      }
    `
  );

  await applicationGenerator(tree, {
    name: name,
    linter: 'eslint',
    skipFormat: false,
    unitTestRunner: unitTestrunner,
  });

  return tree;
}
