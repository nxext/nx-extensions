import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';
import { readJsonInTree } from '@nrwl/workspace';
import { CoreSchema } from '../core/schema';

describe('stencil schematic', () => {
  let appTree: Tree;
  const options: CoreSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@nxext/stencil',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('ng-add', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });

  it('should add Stencil Library dependencies', async () => {
    const result = await testRunner
      .runSchematicAsync('ng-add', {}, appTree)
      .toPromise();
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
  });
});
