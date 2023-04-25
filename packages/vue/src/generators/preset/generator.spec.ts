import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit';

import generator from './generator';
import { PresetSchema } from './schema';
import { Linter } from '@nrwl/linter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../utils/utils');

describe('preset generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

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
        '@nx/workspace': '15.7.0',
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
