import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { applicationGenerator } from '../application/generator';

export async function createTestProject(
  name: string,
  unitTestrunner: 'none' | 'vitest' = 'none'
): Promise<Tree> {
  const tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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
    linter: Linter.EsLint,
    skipFormat: false,
    unitTestRunner: unitTestrunner,
  });

  return tree;
}
