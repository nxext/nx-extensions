import { SvelteApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readJson } from '@nrwl/devkit';

describe('svelte app schematic', () => {
  let tree;
  const options: SvelteApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
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

    expect(tree.exists(`apps/${options.name}/svelte.config.js`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/tsconfig.app.json`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/tsconfig.spec.json`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/tsconfig.json`)).toBeTruthy();
    expect(tree.exists(`apps/${options.name}/.eslintrc.json`)).toBeFalsy();
    expect(tree.exists(`apps/${options.name}/.eslintrc.js`)).toBeTruthy();
  });
});
