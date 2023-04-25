import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson, readJson, Tree as NxTree } from '@nx/devkit';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Update 11.0.0', () => {
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
          '@ionic/angular': '^5.5.1',
        },
      })
    );
  });

  // TODO: issue with schematic tree and nx tree test now is broken
  it.skip(`should update dependencies`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-11.0.0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJson(
      result as unknown as NxTree,
      '/package.json'
    );
    expect(dependencies['@ionic/angular']).toEqual('^5.5.2');
  });
});
