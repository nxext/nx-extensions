import { Schema } from './schema';
import { initGenerator } from './init';
import { readJson, Tree, addDependenciesToPackageJson } from '@nrwl/devkit';
import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';

describe('init', () => {
  let tree: Tree;
  const options: Schema = {
    skipFormat: true,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(tree, {}, {'@nrwl/workspace': '15.4.1'});
  });

  it('should add Solid dependencies', async () => {
    console.log(tree.read('package.json', 'utf-8'));
    await initGenerator(tree, options);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['solid-js']).toBeDefined();
    expect(packageJson.devDependencies['solid-jest']).toBeDefined();
  });
});
