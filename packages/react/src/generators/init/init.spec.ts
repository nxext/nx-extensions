import { Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { reactInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.ts')).toEqual(false);
  });
});
