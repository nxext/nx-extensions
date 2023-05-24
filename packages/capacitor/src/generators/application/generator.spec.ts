import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import generator from './generator';
import { AppGeneratorSchema } from './schema';

describe('app generator', () => {
  let tree: Tree;
  const options: AppGeneratorSchema = {
    name: 'test',
    appId: 'com.test.app',
    unitTestRunner: 'vitest',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await generator(tree, options);

    expect(tree.exists('apps/test/src/main.ts')).toBeTruthy();
  });
});
