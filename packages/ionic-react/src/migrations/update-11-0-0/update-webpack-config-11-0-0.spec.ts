import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nx/devkit';
import { readJsonInTree } from '@nx/workspace';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Update Webpack Config 11.0.0', () => {
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
          ['my-app-1']: {
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

  it(`should Webpack plugin`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-webpack-config-11.0.0', {}, initialTree)
      .toPromise();

    const workspaceJson = readJsonInTree(result, '/workspace.json');
    expect(
      workspaceJson.projects['my-app-1'].architect.build.options.webpackConfig
    ).toEqual('@nrwl/react/plugins/webpack');
  });
});
