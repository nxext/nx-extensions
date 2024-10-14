import { SvelteLibrarySchema } from './schema';
import { Linter } from '@nx/eslint';
import { readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './library';

describe('svelte library schematic', () => {
  let tree;
  const options: SvelteLibrarySchema = {
    directory: 'libs/my-lib',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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

    expect(tree.exists(`libs/my-lib/svelte.config.cjs`)).toBeTruthy();
    expect(tree.exists(`libs/my-lib/tsconfig.lib.json`)).toBeTruthy();
    expect(tree.exists(`libs/my-lib/tsconfig.spec.json`)).toBeTruthy();
    expect(tree.exists(`libs/my-lib/tsconfig.json`)).toBeTruthy();
    expect(tree.exists(`libs/my-lib/.eslintrc.json`)).toBeFalsy();
    expect(tree.exists(`libs/my-lib/.eslintrc.js`)).toBeTruthy();
  });

  it('should fail if no importPath is provided with publishable', async () => {
    try {
      await libraryGenerator(tree, {
        ...options,
        publishable: true,
      });
    } catch (error) {
      expect(error.message).toContain(
        'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)'
      );
    }
  });

  it('should add vite types to tsconfigs', async () => {
    await libraryGenerator(tree, {
      ...options,
      unitTestRunner: 'vitest',
    });
    const tsconfigApp = readJson(tree, `libs/my-lib/tsconfig.lib.json`);
    expect(tsconfigApp.compilerOptions.types).toEqual([
      'svelte',
      'node',
      'vite/client',
    ]);
    const tsconfigSpec = readJson(tree, `libs/my-lib/tsconfig.spec.json`);
    expect(tsconfigSpec.compilerOptions.types).toEqual([
      'vitest/globals',
      'vitest/importMeta',
      'vite/client',
      'node',
      'vitest',
    ]);
  });
});
