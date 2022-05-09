import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 1.1.0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxtend/capacitor',
      path.join(__dirname, '../../../migrations.json')
    );

    initialTree.overwrite(
      'workspace.json',
      serializeJson({
        projects: {
          'my-app-cap': {
            root: 'apps/my-app-cap',
            architect: {
              add: {
                builder: '@nxtend/capacitor:add',
              },
            },
          },
        },
      })
    );

    initialTree.create('apps/my-app-cap/package.json', serializeJson({}));
  });

  it(`should delete Capacitor project package.json`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('delete-package-json-1-1-0', {}, initialTree)
      .toPromise();

    expect(result.exists('apps/my-app-cap/package.json')).toBeFalsy();
  });
});
