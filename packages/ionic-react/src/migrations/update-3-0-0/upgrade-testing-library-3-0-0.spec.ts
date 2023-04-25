import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nx/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 3.0.0', () => {
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
        devDependencies: {
          '@testing-library/jest-dom': '5.10.1',
          '@testing-library/user-event': '12.0.9',
        },
      })
    );
  });

  it(`should upgrade testing libraries`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('upgrade-testing-library-3.0.0', {}, initialTree)
      .toPromise();

    const { devDependencies } = readJsonInTree(result, '/package.json');
    expect(devDependencies['@testing-library/jest-dom']).toEqual('5.11.0');
    expect(devDependencies['@testing-library/user-event']).toEqual('12.0.11');
  });
});
