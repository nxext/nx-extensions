import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { addJestInitPlugin } from './add-jest-plugin';

describe('addJestInitPlugin', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('is a no-op when shouldRun() returns false', async () => {
    const task = await addJestInitPlugin(tree, () => false);

    expect(typeof task).toBe('function');
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies?.['jest']).toBeUndefined();
  });

  it('runs jestInitGenerator when shouldRun() returns true (preact: unitTestRunner === "jest")', async () => {
    await addJestInitPlugin(tree, () => true);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['jest']).toBeDefined();
  });
});
