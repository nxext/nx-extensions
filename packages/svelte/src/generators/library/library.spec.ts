import { SvelteLibrarySchema } from './schema';
import { Linter } from '@nrwl/linter';
import { readJson, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { libraryGenerator } from '@nxext/svelte';

describe('svelte library schematic', () => {
  let tree: Tree;
  const options: SvelteLibrarySchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add Svelte dependencies', async () => {
    await libraryGenerator(tree, options);
    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['svelte']).toBeDefined();
    expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
    expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
  });

  it('should add Svelte project files', async () => {
    await libraryGenerator(tree, options);

    expect(tree.exists(`libs/${options.name}/svelte.config.js`)).toBe(true);
    expect(tree.exists(`libs/${options.name}/tsconfig.lib.json`)).toBe(true);
    expect(tree.exists(`libs/${options.name}/tsconfig.spec.json`)).toBe(true);
    expect(tree.exists(`libs/${options.name}/tsconfig.json`)).toBe(true);
  });
});
