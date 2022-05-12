import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { serializeJson } from '@nrwl/devkit';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import * as path from 'path';

describe('Update 3.1.0', () => {
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
          '@ionic/react': '5.3.1',
          '@ionic/react-router': '5.3.1',
          '@nxext/capacitor': '1.0.0',
          '@testing-library/cypress': '6.0.0',
          '@testing-library/jest-dom': '5.11.0',
          '@testing-library/user-event': '12.0.11',
          ionicons: '5.0.1',
        },
      })
    );
  });

  it(`should upgrade @nxext/capacitor`, async () => {
    const result = await schematicRunner
      .runSchematicAsync('update-3.1.0', {}, initialTree)
      .toPromise();

    const { dependencies } = readJsonInTree(result, '/package.json');
    expect(dependencies['@ionic/react']).toEqual('5.3.2');
    expect(dependencies['@ionic/react-router']).toEqual('5.3.2');
    expect(dependencies['@nxext/capacitor']).toEqual('1.1.0');
    expect(dependencies['@testing-library/cypress']).toEqual('7.0.0');
    expect(dependencies['@testing-library/jest-dom']).toEqual('5.11.4');
    expect(dependencies['@testing-library/user-event']).toEqual('12.1.5');
    expect(dependencies['ionicons']).toEqual('5.1.2');
  });
});
