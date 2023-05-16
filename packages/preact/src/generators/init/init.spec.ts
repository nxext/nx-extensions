import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

describe('init schematic', () => {
  let host: Tree;
  const options: Schema = {
    skipFormat: true,
    unitTestRunner: 'vitest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add Preact dependencies', async () => {
    await initGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['preact']).toBeDefined();
  });
});
