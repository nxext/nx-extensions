import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '../application/application';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '../library/library';

export async function createTestProject(
  directory: string,
  type: 'application' | 'library' = 'application',
  unitTestrunner: 'none' | 'jest' = 'none',
  e2eTestrunner: 'none' | 'cypress' = 'none',
): Promise<Tree> {
  const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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

  if (type === 'application') {
    await applicationGenerator(tree, {
      directory,
      linter: 'eslint',
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
    });
  }
  if (type === 'library') {
    await libraryGenerator(tree, {
      directory,
      linter: 'eslint',
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      skipFormat: false,
    });
  }

  return tree;
}
