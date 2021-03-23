import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { SveltekitGeneratorSchema } from './schema';

describe('sveltekit generator', () => {
  let appTree: Tree;
  const options: SveltekitGeneratorSchema = { name: 'test', skipFormat: false };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
