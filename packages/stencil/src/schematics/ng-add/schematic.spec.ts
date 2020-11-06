import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { runSchematic } from '../../utils/testing';
import { InitSchema } from '../init/schema';

describe('stencil schematic', () => {
  let appTree: Tree;
  const options: InitSchema = { name: 'test' };

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
