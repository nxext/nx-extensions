import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { reactInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.ts')).toEqual(false);
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.ts')).toEqual(false);
  });

  it('should add vite as a devDependency', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['vite']).toBeDefined();
  });
});
