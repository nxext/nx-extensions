import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import initGenerator from './init';
import { InitSchema } from './schema';

describe('init generator', () => {
  let host: Tree;
  const options: InitSchema = {
    unitTestRunner: 'vitest',
    e2eTestRunner: 'none',
    routing: false,
    skipFormat: false,
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await initGenerator(host, options);
  });
});
