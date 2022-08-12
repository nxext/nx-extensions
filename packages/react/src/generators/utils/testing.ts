import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

export function createTestProject() {
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

  return tree;
}
