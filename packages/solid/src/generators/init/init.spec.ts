import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nrwl/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('./lib/util');

describe('init', () => {
  let host: Tree;
  const options: Schema = {
    skipFormat: true,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add Solid dependencies', async () => {
    await initGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['solid-js']).toBeDefined();
    expect(packageJson.devDependencies['solid-jest']).toBeDefined();
  });
});
