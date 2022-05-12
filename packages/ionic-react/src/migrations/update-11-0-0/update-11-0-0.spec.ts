import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 11.0.0', () => {
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
          '@ionic/react': '^5.5.1',
          '@ionic/react-router': '^5.5.1',
        },
      })
    );
  });

  it(`should update dependencies`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-11.0.0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies['@ionic/react']).toEqual('^5.5.2');
    expect(dependencies['@ionic/react-router']).toEqual('^5.5.2');
  });
});
