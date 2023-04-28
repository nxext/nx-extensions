import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, updateJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../utils/utils');

describe('init schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('16.0.0');

  let host: Tree;
  const options: Schema = {
    skipFormat: true,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '16.0.0',
      };
      return json;
    });
  });

  it('should add Preact dependencies', async () => {
    await initGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['preact']).toBeDefined();
  });
});
