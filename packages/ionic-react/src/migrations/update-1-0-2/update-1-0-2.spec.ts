import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nx/devkit';
import { readJsonInTree } from '@nx/workspace';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Update 1.0.2', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxext/ionic-react',
      path.join(__dirname, '../../../migrations.json')
    );

    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {
          '@ionic/react': '5.0.5',
          '@ionic/react-router': '5.0.5',
        },
      })
    );
  });

  it(`should update Ionic to 5.0.7`, async () => {
    // eslint-disable-next-line require-atomic-updates
    const result = await schematicRunner
      .runSchematicAsync('update-1.0.2', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies['@ionic/react']).toEqual('5.0.7');
    expect(dependencies['@ionic/react-router']).toEqual('5.0.7');
  });
});
