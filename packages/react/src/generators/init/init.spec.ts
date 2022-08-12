import { readJson, Tree } from '@nrwl/devkit';
import { createTestProject } from '../utils/testing';

import { reactInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTestProject();
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.ts')).toEqual(false);
  });

  it('should add jest config if unitTestRunner is jest', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'jest' });
    expect(tree.exists('jest.config.ts')).toEqual(true);
  });

  it('should add the correct jest plugin version', async (): Promise<void> => {
    await reactInitGenerator(tree, { unitTestRunner: 'jest' });
    expect(
      JSON.parse(tree.read('package.json').toString()).devDependencies[
        '@nrwl/jest'
      ]
    ).toEqual('0.0.0');
  });

  it('should add vite as a devDependency', async () => {
    await reactInitGenerator(tree, { unitTestRunner: 'none' });

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['vite']).toBeDefined();
  });
});
