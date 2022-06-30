import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nxext/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 2.0.0', () => {
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
          '@testing-library/cypress': '5.3.0',
          '@testing-library/jest-dom': '4.2.4',
          '@testing-library/user-event': '8.1.3',
        },
      })
    );
  });

  it(`should update @testing-library/cypress to 6.0.0`, async () => {
    // eslint-disable-next-line require-atomic-updates
    const result = await schematicRunner
      .runSchematicAsync('update-2.0.0', {}, initialTree)
      .toPromise();

    const { devDependencies } = readJsonInTree(result, '/package.json');
    expect(devDependencies['@testing-library/cypress']).toEqual('6.0.0');
  });

  it(`should update @testing-library/jest-dom to 5.5.0`, async () => {
    // eslint-disable-next-line require-atomic-updates
    const result = await schematicRunner
      .runSchematicAsync('update-2.0.0', {}, initialTree)
      .toPromise();

    const { devDependencies } = readJsonInTree(result, '/package.json');
    expect(devDependencies['@testing-library/jest-dom']).toEqual('5.5.0');
    expect(devDependencies['@testing-library/user-event']).toEqual('10.0.1');
  });

  it(`should update @testing-library/user-event to 10.0.1`, async () => {
    // eslint-disable-next-line require-atomic-updates
    const result = await schematicRunner
      .runSchematicAsync('update-2.0.0', {}, initialTree)
      .toPromise();

    const { devDependencies } = readJsonInTree(result, '/package.json');
    expect(devDependencies['@testing-library/user-event']).toEqual('10.0.1');
  });
});
