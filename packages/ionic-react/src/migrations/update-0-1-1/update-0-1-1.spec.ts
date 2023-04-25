import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nx/workspace';
import { createEmptyWorkspace } from '@nx/workspace/testing';
import * as path from 'path';

describe('Update 0-1-0', () => {
  let tree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeEach(async () => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
    schematicRunner = new SchematicTestRunner(
      '@nxext/ionic-react',
      path.join(__dirname, '../../../migrations.json')
    );
  });

  it(`should add @nrwl/react lib`, async () => {
    // eslint-disable-next-line require-atomic-updates
    tree = await schematicRunner
      .runSchematicAsync('update-0.1.1', {}, tree)
      .toPromise();

    const packageJson = readJsonInTree(tree, '/package.json');
    expect(packageJson).toMatchObject({
      devDependencies: {
        '@nrwl/react': '9.0.0',
      },
    });
  });
});
