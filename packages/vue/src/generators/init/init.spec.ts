import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import { Tree } from '@nrwl/devkit';

import initGenerator from './init';
import { InitSchema } from './schema';

describe('init generator', () => {
  let appTree: Tree;
  const options: InitSchema = {
    unitTestRunner: 'vitest',
    e2eTestRunner: 'none',
    routing: false,
    skipFormat: false,
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyV1Workspace();
  });

  it('should run successfully', async () => {
    await initGenerator(appTree, options);
  });
});
