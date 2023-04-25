import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './library';
import { Schema } from './schema';
import { Linter } from '@nrwl/linter';

describe('vite library generator', () => {
  let tree: Tree;
  const options = {
    name: 'test',
    linter: Linter.EsLint,
    skipFormat: false,
    unitTestRunner: 'jest',
    skipTsConfig: false,
  } as Schema;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
