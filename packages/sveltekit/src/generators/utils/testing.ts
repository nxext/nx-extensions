import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { applicationGenerator } from '../application/generator';

export async function createTestProject(
  name: string,
  unitTestrunner: 'none' | 'vitest' = 'none',
  // Same pattern as @nxext/svelte's utils/testing.ts: pass
  // `createTsSolutionTree()` (from @nxext/common) here to scaffold the test
  // project into a TS-solution workspace instead of the default legacy one.
  tree: Tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' }),
): Promise<Tree> {
  // Merge instead of overwrite: createTsSolutionTree seeds a `workspaces`
  // field that package-manager detection needs when the tests run without a
  // pnpm user agent (e.g. on CI agents).
  const rootPkg = JSON.parse(tree.read('package.json', 'utf-8') ?? '{}');
  tree.write(
    'package.json',
    JSON.stringify({
      ...rootPkg,
      name: 'test-name',
      dependencies: { ...(rootPkg.dependencies ?? {}) },
      devDependencies: {
        ...(rootPkg.devDependencies ?? {}),
        '@nx/workspace': '0.0.0',
      },
    }),
  );

  await applicationGenerator(tree, {
    name: name,
    linter: 'eslint',
    skipFormat: false,
    unitTestRunner: unitTestrunner,
  });

  return tree;
}
