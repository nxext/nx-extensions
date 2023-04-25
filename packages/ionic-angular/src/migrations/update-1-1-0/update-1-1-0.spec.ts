import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson, readJson, Tree as NxTree } from '@nx/devkit';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('update-1.1.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nx/plugin',
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

  // TODO: issue with schematic tree and nx tree test now is broken
  it.skip(`should update dependencies`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-1.1.0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJson(
      result as unknown as NxTree,
      '/package.json'
    );
    expect(dependencies['@ionic/angular']).toEqual('^5.5.1');
    expect(dependencies['@ionic-native/core']).toEqual('^5.30.0');
    expect(dependencies['@ionic-native/splash-screen']).toEqual('^5.30.0');
    expect(dependencies['@ionic-native/status-bar']).toEqual('^5.30.0');
  });
});
