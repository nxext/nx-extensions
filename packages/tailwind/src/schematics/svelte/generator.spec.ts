import { Schema } from './schema';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from '@nxext/svelte';
import { readJson, Tree } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import tailwindSvelteGenerator from './generator';

describe('svelte schematic', () => {
  let tree: Tree;
  const options: Schema = { project: 'test' };

  beforeEach(async () => {
    tree = await createTestApp('test');
  });

  it('should create files', async () => {
    await tailwindSvelteGenerator(tree, options)

    expect(tree.exists(`apps/${options.project}/src/Tailwind.svelte`)).toBe(true);
    expect(tree.exists(`apps/${options.project}/tailwind.config.js`)).toBe(true);
    expect(tree.exists(`apps/${options.project}/update-svelte-preprocess.js`)).toBe(true);
  });

  it('should add dependencies', async () => {
    await tailwindSvelteGenerator(tree, options)

    const packageJson = readJson(tree, '/package.json');
    expect(packageJson.devDependencies['tailwindcss']).toBeDefined();
  });
});

export async function createTestApp(name: string) {
  const tree = createTreeWithEmptyWorkspace();
  await applicationGenerator(tree, {
    name: name,
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  })

  return tree;
}
