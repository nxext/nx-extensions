import { AppType } from '../../utils/typings';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { initGenerator } from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add stencil dependencies', async () => {
    await initGenerator(tree, { name: 'test', appType: AppType.library });
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
  });

  it('should add stencil app dependencies', async () => {
    await initGenerator(tree, { name: 'test', appType: AppType.application });
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/router']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should add stencil pwa dependencies', async () => {
    await initGenerator(tree, { name: 'test', appType: AppType.pwa });
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await initGenerator(tree, { name: 'test', appType: AppType.application });
      const workspaceJson = readJson(tree, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nxext/stencil');
    });
  });
});
