import { readJson } from '@nxext/devkit';
import { default as update } from './add-dependencies-installed-automatically-now';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('add-dependencies-installed-automatically-now', () => {
  let tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.overwrite(
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
  });

  it(`should update dependencies`, async () => {
    update(tree);

    const { devDependencies } = readJson(tree, '/package.json');
    expect(devDependencies['@nrwl/cypress']).toBeDefined();
    expect(devDependencies['@nrwl/linter']).toBeDefined();
    expect(devDependencies['@nrwl/jest']).toBeDefined();
  });
});
