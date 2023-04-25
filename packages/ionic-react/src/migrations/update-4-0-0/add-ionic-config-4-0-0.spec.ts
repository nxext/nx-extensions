import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nx/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('add-ionic-config-4-0-0', () => {
  let initialTree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    initialTree = createEmptyWorkspace(Tree.empty());

    schematicRunner = new SchematicTestRunner(
      '@nxext/ionic-react',
      path.join(__dirname, '../../../migrations.json')
    );

    initialTree.overwrite(
      'workspace.json',
      serializeJson({
        projects: {
          'test-app': {
            root: 'apps/test-app',
            architect: {
              build: {
                options: {
                  webpackConfig: '@nxext/ionic-react/plugins/webpack',
                },
              },
            },
          },
        },
      })
    );
  });

  it(`should add ionic.config.json`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('add-ionic-config-4.0.0', {}, initialTree)
      .toPromise();

    const ionicConfigJson = readJsonInTree(
      result,
      'apps/test-app/ionic.config.json'
    );
    expect(ionicConfigJson).toBeTruthy();
    expect(ionicConfigJson.name).toEqual('test-app');
  });

  it(`should add not ionic.config.json if one exists`, async () => {
    initialTree.create('apps/test-app/ionic.config.json', JSON.stringify({}));

    const result = await schematicRunner
      .runSchematicAsync('add-ionic-config-4.0.0', {}, initialTree)
      .toPromise();

    const ionicConfigJson = readJsonInTree(
      result,
      'apps/test-app/ionic.config.json'
    );
    expect(ionicConfigJson).toEqual({});
  });
});
