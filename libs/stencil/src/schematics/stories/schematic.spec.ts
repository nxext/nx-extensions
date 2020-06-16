import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { StoriesSchematicSchema } from './schematic';

describe('stories schematic', () => {
  let appTree: Tree;
  const options: StoriesSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nxext/stories',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('stories', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
