import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration, updateJson } from '@nrwl/devkit';

import generator from './generator';
import { PresetSchema } from './schema';
import { Linter } from '@nrwl/linter';

describe('preset generator', () => {
  let host: Tree;
  const options: PresetSchema = {
    name: 'test',
    vueAppName: 'test',
    linter: Linter.None,
    skipFormat: false,
    e2eTestRunner: 'cypress',
    unitTestRunner: 'none',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nrwl/workspace': '15.6.0',
      };
      return json;
    });
  });

  it('should run successfully', async () => {
    await generator(host, options);
    const config = readProjectConfiguration(host, 'test');
    expect(config).toBeDefined();
  });
});
