import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import generator from './application';
import { Schema } from './schema';
import { Linter } from '@nrwl/linter';

describe('vite application generator', () => {
  let tree: Tree;
  const options = {
    name: 'test',
    linter: Linter.EsLint,
    skipFormat: false,
    supportJSX: true,
    unitTestRunner: 'jest',
  } as Schema;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    tree.write(
      'package.json',
      `
      {
        "name": "test-name",
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

  it('should add jest files', async () => {
    await generator(tree, { ...options, unitTestRunner: 'jest' });
    const config = readProjectConfiguration(tree, 'test');

    expect(config.targets['test']).toBeDefined();
    expect(config.targets['test'].executor).toBe('@nrwl/jest:jest');

    expect(tree.exists(`apps/${options.name}/jest.config.ts`)).toBeTruthy();
    expect(tree.exists(`jest.config.ts`)).toBeTruthy();
    expect(tree.exists(`jest.preset.js`)).toBeTruthy();

    expect(tree.exists(`apps/${options.name}/vitest.config.ts`)).toBeFalsy();
    expect(tree.exists(`vitest.config.ts`)).toBeFalsy();
  });

  it('should add vitest files', async () => {
    await generator(tree, { ...options, unitTestRunner: 'vitest' });
    const config = readProjectConfiguration(tree, 'test');

    expect(config.targets['test']).toBeDefined();
    expect(config.targets['test'].executor).toBe('@nxext/vitest:vitest');

    expect(tree.exists(`apps/${options.name}/vitest.config.ts`)).toBeTruthy();
    expect(tree.exists(`vitest.config.ts`)).toBeTruthy();

    expect(tree.exists(`apps/${options.name}/jest.config.ts`)).toBeFalsy();
    expect(tree.exists(`jest.config.ts`)).toBeFalsy();
    expect(tree.exists(`jest.preset.js`)).toBeFalsy();
  });
});
