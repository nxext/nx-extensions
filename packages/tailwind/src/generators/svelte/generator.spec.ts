import { Schema } from './schema';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from '@nxext/svelte';
import { readJson } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import tailwindSvelteGenerator from './generator';

describe('svelte schematic', () => {
  let tree;
  const options: Schema = { project: 'test' };

  beforeEach(async () => {
    tree = await createTestApp('test');
  });

  it('should create files', async () => {
    await tailwindSvelteGenerator(tree, options);

    expect(tree.exists(`apps/${options.project}/src/Tailwind.svelte`)).toBe(
      true
    );
    expect(tree.exists(`apps/${options.project}/tailwind.config.js`)).toBe(
      true
    );
    expect(
      tree.exists(`apps/${options.project}/update-svelte-preprocess.js`)
    ).toBe(true);
  });

  it('should add dependencies', async () => {
    await tailwindSvelteGenerator(tree, options);

    const packageJson = readJson(tree, '/package.json');
    expect(packageJson.devDependencies['tailwindcss']).toBeDefined();
  });

  it('should add import to App.svelte', async () => {
    await tailwindSvelteGenerator(tree, options);

    expect(tree.exists(`apps/${options.project}/src/Tailwind.svelte`)).toBe(
      true
    );

    expect(
      tree.read(`apps/${options.project}/src/App.svelte`).toString('utf-8')
    ).toContain(`import './Tailwind.svelte';`);
  });
});

export async function createTestApp(name: string) {
  const tree = createTreeWithEmptyWorkspace();
  tree.overwrite(
    'package.json',
    `
      {
        "name": "test-name",
        "dependencies": {},
        "devDependencies": {
          "@nrwl/workspace": "0.0.0"
        }
      }
    `
  );
  await applicationGenerator(tree, {
    name: name,
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  });

  return tree;
}
