import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { addCypressInitPlugin } from './add-cypress-plugin';

describe('addCypressInitPlugin', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('is a no-op when shouldRun() returns false', async () => {
    const task = await addCypressInitPlugin(tree, () => false);

    expect(typeof task).toBe('function');
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies?.['cypress']).toBeUndefined();
  });

  it('runs cypressInitGenerator when shouldRun() returns true (preact: e2eTestRunner === "cypress")', async () => {
    await addCypressInitPlugin(tree, () => true);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['cypress']).toBeDefined();
  });
});
