import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from '../application/application';
import { Tree, ProjectType } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '../library/library';

export async function createTestProject(
  directory: string,
  type: ProjectType = 'application',
  tree: Tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' }),
  unitTestrunner: 'none' | 'jest' = 'none',
  e2eTestrunner: 'none' | 'cypress' = 'none'
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

  if (type === 'application') {
    await applicationGenerator(tree, {
      directory,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
    });
  }
  if (type === 'library') {
    await libraryGenerator(tree, {
      directory,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      buildable: true,
      skipFormat: false,
    });
  }

  return tree;
}
