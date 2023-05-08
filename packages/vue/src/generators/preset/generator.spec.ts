import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration, updateJson } from '@nx/devkit';

import generator from './generator';
import { PresetSchema } from './schema';
import { Linter } from '@nx/linter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('preset generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

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
  });

  it('should run successfully', async () => {
    await generator(host, options);
    const config = readProjectConfiguration(host, 'test');
    expect(config).toBeDefined();
  });
});
