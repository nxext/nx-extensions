import { SvelteApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';

describe('svelte app schematic', () => {
  let appTree: Tree;
  const options: SvelteApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add Svelte dependencies', async () => {
    await applicationGenerator(appTree, options);
    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['svelte']).toBeDefined();
    expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
    expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
  });
});
