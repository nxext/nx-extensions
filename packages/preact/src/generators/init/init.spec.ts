import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, updateJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('init schematic', () => {
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
        '@nrwl/workspace': '15.6.0',
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
