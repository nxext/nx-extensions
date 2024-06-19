import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration, Tree } from '@nx/devkit';

import { applicationGenerator } from './generator';
import { SveltekitGeneratorSchema } from './schema';
import { Linter } from '@nx/eslint';

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
    await applicationGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
