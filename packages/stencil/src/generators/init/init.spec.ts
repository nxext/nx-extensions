import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { AppType } from '../../utils/typings';
import { runSchematic } from '../../utils/testing';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
  });

  it('should add stencil dependencies', async () => {
    const result = await runSchematic(
      'init',
      { name: 'test', appType: AppType.library },
      tree
    );
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
  });

  it('should add stencil app dependencies', async () => {
    const result = await runSchematic(
      'init',
      { name: 'test', appType: AppType.application },
      tree
    );
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/router']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should add stencil pwa dependencies', async () => {
    const result = await runSchematic(
      'init',
      { name: 'test', appType: AppType.pwa },
      tree
    );
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      const result = await runSchematic(
        'init',
        { name: 'test', appType: AppType.library },
        tree
      );
      const workspaceJson = readJsonInTree(result, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nxext/stencil');
    });
  });
});
