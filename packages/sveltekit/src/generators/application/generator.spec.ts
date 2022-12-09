import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';

import generator from './generator';
import { SveltekitGeneratorSchema } from './schema';
import { Linter } from '@nrwl/linter';

describe('sveltekit generator', () => {
  let tree: Tree;
  const options: SveltekitGeneratorSchema = {
    name: 'test',
    skipFormat: false,
    linter: Linter.EsLint,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write(
      'package.json',
      `
      {
        "name": "sveltekit-test",
        "dependencies": {},
        "devDependencies": {
          "@nrwl/workspace": "0.0.0"
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
