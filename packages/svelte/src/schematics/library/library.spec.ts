import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { SvelteLibrarySchema } from './schema';
import { readJsonInTree } from '@nrwl/workspace';
import { Linter } from '@nrwl/linter';
import { runSchematic } from '../utils/testing';

describe('svelte library schematic', () => {
  let appTree: Tree;
  const options: SvelteLibrarySchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should add Svelte dependencies', async () => {
    const result = await runSchematic('lib', options, appTree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['svelte']).toBeDefined();
    expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
    expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
  });
});
