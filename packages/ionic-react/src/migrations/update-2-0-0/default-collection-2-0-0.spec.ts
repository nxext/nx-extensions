import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nx/workspace';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Default Collection 2.0.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxext/ionic-react',
      path.join(__dirname, '../../../migrations.json')
    );
  });

  it(`should set default collection`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('default-collection-2.0.0', {}, initialTree)
      .toPromise();
    const workspaceJson = readJsonInTree(result, '/workspace.json');

    expect(workspaceJson.cli.defaultCollection).toEqual('@nxext/ionic-react');
  });
});
