import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { AppType } from '../../utils/typings';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';
import { runSchematic } from '../../utils/testing';

describe('init', () => {
  let tree: Tree;

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

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
    const result = await testRunner
      .runSchematicAsync(
        'init',
        { name: 'test', appType: AppType.application },
        tree
      )
      .toPromise();
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/router']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should add stencil pwa dependencies', async () => {
    const result = await testRunner
      .runSchematicAsync('init', { name: 'test', appType: AppType.pwa }, tree)
      .toPromise();
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      const result = await testRunner
        .runSchematicAsync(
          'init',
          { name: 'test', appType: AppType.library },
          tree
        )
        .toPromise();
      const workspaceJson = readJsonInTree(result, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nxext/stencil');
    });
  });
});
