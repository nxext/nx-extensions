import { addDependenciesToPackageJson, readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { viteVersion } from '../../utils/version';
import { viteInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

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

  it('should add dependencies', async () => {
    await viteInitGenerator(tree, {});

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['vite']).toBeUndefined();
    expect(packageJson.devDependencies['vite']).toBeDefined();
  });

  it('should add jest', async () => {
    addDependenciesToPackageJson(
      tree,
      {
        vite: viteVersion,
      },
      {}
    );
    await viteInitGenerator(tree, { unitTestRunner: 'jest' });

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['jest']).toBeDefined();
  });

  it('should add vitest', async () => {
    addDependenciesToPackageJson(
      tree,
      {
        vite: viteVersion,
      },
      {}
    );
    await viteInitGenerator(tree, { unitTestRunner: 'vitest' });

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['vitest']).toBeDefined();
  });
});
