import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration, Tree } from '@nx/devkit';

import generator from './generator';
import { SveltekitGeneratorSchema } from './schema';
import { Linter } from '@nx/linter';

describe('sveltekit generator', () => {
  let tree: Tree;
  const options: SveltekitGeneratorSchema = {
    name: 'test',
    skipFormat: false,
    linter: Linter.EsLint,
    unitTestRunner: 'none',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
