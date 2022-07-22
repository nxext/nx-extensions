import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('update-1.1.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nrwl/nx-plugin',
      path.join(__dirname, '../../../migrations.json')
    );

    initialTree.overwrite(
      'package.json',
      serializeJson({
        dependencies: {
          '@ionic/angular': '5.3.4',
          '@ionic-native/core': '5.29.0',
          '@ionic-native/splash-screen': '5.29.0',
          '@ionic-native/status-bar': '5.29.0',
        },
      })
    );
  });

  it(`should update dependencies`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-1.1.0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies['@ionic/angular']).toEqual('^5.5.1');
    expect(dependencies['@ionic-native/core']).toEqual('^5.30.0');
    expect(dependencies['@ionic-native/splash-screen']).toEqual('^5.30.0');
    expect(dependencies['@ionic-native/status-bar']).toEqual('^5.30.0');
  });
});
