import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nrwl/workspace';
import * as path from 'path';
import { createTestUILib } from '../../utils/testing';

describe('update-0-1-0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = await createTestUILib('library');

    schematicRunner = new SchematicTestRunner(
      '@nrwl/nx-plugin',
      path.join(__dirname, '../../../migrations.json')
    );

    const workspaceJson = readJsonInTree(initialTree, '/workspace.json');
    delete workspaceJson.projects.library.schematics;

    initialTree.overwrite('/workspace.json', JSON.stringify(workspaceJson));
  });

  it(`should update component schematics config`, async () => {
    initialTree = await schematicRunner
      .runSchematicAsync('update-0-1-0', {}, initialTree)
      .toPromise();

    const workspaceJson = readJsonInTree(initialTree, '/workspace.json');

    expect(workspaceJson.projects.library.schematics).toEqual({
      '@nxext/stencil:component': {
        style: 'css',
        storybook: false,
      },
    });
  });
});
