import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree } from '@nxext/devkit';
import { Linter } from '@nrwl/linter';
import applicationGenerator from '../application/generator';

export async function createTestProject(
  name: string,
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

  await applicationGenerator(tree, {
    name: name,
    linter: Linter.EsLint,
    skipFormat: false,
  });

  return tree;
}
