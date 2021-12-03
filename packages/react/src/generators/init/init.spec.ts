import {
  addDependenciesToPackageJson,
  NxJsonConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { viteVersion } from '../../utils/version';
import { viteInitGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add dependencies', async () => {
    const existing = 'existing';
    const existingVersion = '1.0.0';

    addDependenciesToPackageJson(
      tree,
      {
        [existing]: existingVersion,
        vite: viteVersion,
      },
      {
        [existing]: existingVersion,
      }
    );
    await viteInitGenerator(tree, {});

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['vite']).toBeDefined();
    expect(packageJson.dependencies['tslib']).toBeDefined();
    expect(packageJson.dependencies[existing]).toBeDefined();
    expect(packageJson.devDependencies['vite']).toBeUndefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await viteInitGenerator(tree, {});
      const nxJson = readJson<NxJsonConfiguration>(tree, 'nx.json');
      expect(nxJson.cli.defaultCollection).toEqual('@nxext/vite');
    });
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await viteInitGenerator(tree, { unitTestRunner: 'none' });
    expect(tree.exists('jest.config.js')).toEqual(false);
  });
});
