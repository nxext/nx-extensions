import { SvelteApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readJson } from '@nrwl/devkit';

describe('svelte app schematic', () => {
  let tree: Tree;
  const options: SvelteApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add Svelte dependencies', async () => {
    await applicationGenerator(tree, options);
    const packageJson = readJson(tree, 'package.json');

    expect(packageJson.devDependencies['svelte']).toBeDefined();
    expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
    expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
  });

  it('should add Svelte project files', async () => {
    await applicationGenerator(tree, options);

    expect(tree.exists(`apps/${options.name}/svelte.config.js`)).toBe(true);
    expect(tree.exists(`apps/${options.name}/tsconfig.app.json`)).toBe(true);
    expect(tree.exists(`apps/${options.name}/tsconfig.spec.json`)).toBe(true);
    expect(tree.exists(`apps/${options.name}/tsconfig.json`)).toBe(true);
  });
});
