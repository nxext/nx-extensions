import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 1.1.0', () => {
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
          '@capacitor/core': '2.2.1',
          '@capacitor/cli': '2.2.1',
          '@capacitor/android': '2.2.1',
          '@capacitor/ios': '2.2.1',
        },
      })
    );
  });

  it(`should upgrade Capacitor`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('upgrade-capacitor-1-1-0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies['@capacitor/core']).toEqual('2.4.0');
    expect(dependencies['@capacitor/cli']).toEqual('2.4.0');
    expect(dependencies['@capacitor/android']).toEqual('2.4.0');
    expect(dependencies['@capacitor/ios']).toEqual('2.4.0');
  });
});
