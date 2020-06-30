import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { CoreSchema } from '../core/schema';
import { runSchematic } from '../../utils/testing';

describe('stencil schematic', () => {
  let appTree: Tree;
  const options: CoreSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('ng-add', options, appTree)
    ).resolves.not.toThrowError();
  });

  it('should add Stencil Library dependencies', async () => {
    const result = await runSchematic('ng-add', {}, appTree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@nxext/stencil']).toBeDefined();
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
  });
});
