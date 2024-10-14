import { Schema } from './schema';
import { Linter } from '@nx/eslint';
import { applicationGenerator } from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson } from '@nx/devkit';

describe('svelte app generator', () => {
  let tree;
  const options: Schema = {
    directory: 'apps/my-app',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add Svelte dependencies', async () => {
      await applicationGenerator(tree, options);
      const packageJson = readJson(tree, 'package.json');

      expect(packageJson.devDependencies['svelte']).toBeDefined();
      expect(packageJson.devDependencies['svelte-preprocess']).toBeDefined();
      expect(packageJson.devDependencies['svelte-jester']).toBeDefined();
    });

    it('should add dependencies for vite', async () => {
      await applicationGenerator(tree, options);
      const packageJson = readJson(tree, 'package.json');

      expect(
        packageJson.devDependencies['@sveltejs/vite-plugin-svelte']
      ).toBeDefined();
    });

    it('should add Svelte project files', async () => {
      await applicationGenerator(tree, options);

      expect(tree.exists(`apps/my-app/svelte.config.cjs`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.app.json`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.spec.json`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.json`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/.eslintrc.json`)).toBeFalsy();
      expect(tree.exists(`apps/my-app/.eslintrc.js`)).toBeTruthy();
    });

    it('should add vite specific files', async () => {
      await applicationGenerator(tree, options);

      expect(tree.exists(`apps/my-app/svelte.config.cjs`)).toBeTruthy();
    });

    it('should add vite types to tsconfigs', async () => {
      await applicationGenerator(tree, {
        ...options,
        unitTestRunner: 'vitest',
      });
      const tsconfigApp = readJson(tree, `apps/my-app/tsconfig.app.json`);
      expect(tsconfigApp.compilerOptions.types).toEqual([
        'svelte',
        'node',
        'vite/client',
      ]);
      const tsconfigSpec = readJson(tree, `apps/my-app/tsconfig.spec.json`);
      expect(tsconfigSpec.compilerOptions.types).toEqual([
        'vitest/globals',
        'vitest/importMeta',
        'vite/client',
        'node',
        'vitest',
      ]);
    });
  });
});
