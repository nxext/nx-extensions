import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 2.0.0', () => {
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
          ['my-app-1']: {
            architect: {
              add: {
                builder: '@nxtend/capacitor:command',
                options: {
                  command: 'add',
                  platform: '',
                },
                configurations: {
                  platform: 'android',
                  ios: {
                    platform: 'ios',
                  },
                  android: {
                    platform: 'android',
                  },
                },
              },
              copy: {
                builder: '@nxtend/capacitor:command',
                options: {
                  command: 'copy',
                  platform: '',
                },
                configurations: {
                  ios: {
                    platform: 'ios',
                  },
                  android: {
                    platform: 'android',
                  },
                },
              },
              update: {
                builder: '@nxtend/capacitor:command',
                options: {
                  command: 'update',
                  platform: '',
                },
                configurations: {
                  ios: {
                    platform: 'ios',
                  },
                  android: {
                    platform: 'android',
                  },
                },
              },
            },
          },
          ['my-app-2']: {
            architect: {
              add: {
                builder: '@nxtend/capacitor:command',
                options: {
                  command: 'add',
                  platform: '',
                },
              },
            },
          },
        },
      })
    );
  });

  it(`should update @nxtend/capacitor workspace config`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-workspace-json-11.0.0', {}, initialTree)
      .toPromise();

    const workspaceJson = readJsonInTree(result, '/workspace.json');

    expect(workspaceJson.projects['my-app-1'].architect['cap'].builder).toEqual(
      '@nxtend/capacitor:cap'
    );
    expect(
      workspaceJson.projects['my-app-1'].architect['cap'].options.cmd
    ).toEqual('--help');
    expect(
      workspaceJson.projects['my-app-1'].architect['cap'].options.packageInstall
    ).toEqual(true);

    expect(workspaceJson.projects['my-app-1'].architect['add'].builder).toEqual(
      '@nxtend/capacitor:cap'
    );
    expect(
      workspaceJson.projects['my-app-1'].architect['add'].options.cmd
    ).toEqual('add');
    expect(
      workspaceJson.projects['my-app-1'].architect['add'].options.packageInstall
    ).toEqual(true);
    expect(
      workspaceJson.projects['my-app-1'].architect['add'].configurations['ios']
        .cmd
    ).toEqual('add ios');
    expect(
      workspaceJson.projects['my-app-1'].architect['add'].configurations[
        'android'
      ].cmd
    ).toEqual('add android');

    expect(workspaceJson.projects['my-app-1'].architect['add'].builder).toEqual(
      '@nxtend/capacitor:cap'
    );
    expect(
      workspaceJson.projects['my-app-1'].architect['copy'].options.cmd
    ).toEqual('copy');
    expect(
      workspaceJson.projects['my-app-1'].architect['copy'].options
        .packageInstall
    ).toEqual(false);
    expect(
      workspaceJson.projects['my-app-1'].architect['copy'].configurations['ios']
        .cmd
    ).toEqual('copy ios');
    expect(
      workspaceJson.projects['my-app-1'].architect['copy'].configurations[
        'android'
      ].cmd
    ).toEqual('copy android');

    expect(
      workspaceJson.projects['my-app-1'].architect['update'].builder
    ).toEqual('@nxtend/capacitor:cap');
    expect(
      workspaceJson.projects['my-app-1'].architect['update'].options.cmd
    ).toEqual('update');
    expect(
      workspaceJson.projects['my-app-1'].architect['update'].options
        .packageInstall
    ).toEqual(true);
    expect(
      workspaceJson.projects['my-app-1'].architect['update'].configurations[
        'ios'
      ].cmd
    ).toEqual('update ios');
    expect(
      workspaceJson.projects['my-app-1'].architect['update'].configurations[
        'android'
      ].cmd
    ).toEqual('update android');

    expect(workspaceJson.projects['my-app-2'].architect['cap'].builder).toEqual(
      '@nxtend/capacitor:cap'
    );
    expect(
      workspaceJson.projects['my-app-2'].architect['cap'].options.cmd
    ).toEqual('--help');

    expect(workspaceJson.projects['my-app-2'].architect['add'].builder).toEqual(
      '@nxtend/capacitor:cap'
    );
    expect(
      workspaceJson.projects['my-app-2'].architect['add'].options.cmd
    ).toEqual('add');
    expect(
      workspaceJson.projects['my-app-2'].architect['add'].configurations
    ).toBeFalsy();
  });
});
