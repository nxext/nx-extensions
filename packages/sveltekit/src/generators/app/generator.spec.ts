import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';

import generator from './generator';
import { SveltekitGeneratorSchema } from './schema';
import { Linter } from '@nrwl/linter';

describe('sveltekit generator', () => {
  let appTree: Tree;
  const options: SveltekitGeneratorSchema = { name: 'test', skipFormat: false, linter: Linter.EsLint };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
