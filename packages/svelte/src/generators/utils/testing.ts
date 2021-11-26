import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import applicationGenerator from '../application/application';
import { Tree, ProjectType } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '../library/library';

export async function createTestProject(
  name: string,
  type: ProjectType = 'application',
  unitTestrunner: 'none' | 'jest' = 'none',
  e2eTestrunner: 'none' | 'cypress' = 'none'
): Promise<Tree> {
  const tree = createTreeWithEmptyWorkspace();
  tree.write(
    'package.json',
    `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nrwl/workspace": "0.0.0"
        }
      }
    `
  );

  if (type === 'application') {
    await applicationGenerator(tree, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
    });
  }
  if (type === 'library') {
    await libraryGenerator(tree, {
      name: name,
      linter: Linter.EsLint,
      unitTestRunner: unitTestrunner,
      e2eTestRunner: e2eTestrunner,
      skipFormat: false
    });
  }

  return tree;
}
