import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { SvelteApplicationSchema } from './schema';
import { Linter, readJsonInTree } from '@nrwl/workspace';
import { runSchematic } from '../utils/testing';

describe('svelte app schematic', () => {
  let appTree: Tree;
  const options: SvelteApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('app', options, appTree)
    ).resolves.not.toThrowError();
  });

  it('should add Svelte dependencies', async () => {
    const result = await runSchematic('app', options, appTree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['svelte']).toBeDefined();
    expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
    expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
  });
});
