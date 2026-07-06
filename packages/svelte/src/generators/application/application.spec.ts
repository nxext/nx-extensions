import { Schema } from './schema';
import { applicationGenerator } from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { useFlatConfig } from '@nx/eslint/internal';
import { createTsSolutionTree } from '@nxext/common';

describe('svelte app generator', () => {
  let tree;
  const options: Schema = {
    directory: 'apps/my-app',
    linter: 'eslint',
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
        packageJson.devDependencies['@sveltejs/vite-plugin-svelte'],
      ).toBeDefined();
    });

    it('should add Svelte project files', async () => {
      await applicationGenerator(tree, options);

      expect(tree.exists(`apps/my-app/svelte.config.cjs`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.app.json`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.spec.json`)).toBeTruthy();
      expect(tree.exists(`apps/my-app/tsconfig.json`)).toBeTruthy();
    });

    it('should add vite specific files', async () => {
      await applicationGenerator(tree, options);

      expect(tree.exists(`apps/my-app/svelte.config.cjs`)).toBeTruthy();
    });

    it('should wire up eslint-plugin-svelte (flat config) or skip gracefully (legacy config)', async () => {
      await applicationGenerator(tree, options);

      // eslint-plugin-svelte is always declared as a devDependency...
      const packageJson = readJson(tree, 'package.json');
      expect(packageJson.devDependencies['eslint-plugin-svelte']).toBeDefined();
      expect(
        packageJson.devDependencies['eslint-plugin-svelte3'],
      ).toBeUndefined();

      // ...but it can only actually be wired into the generated ESLint
      // config when that config is in flat format, since eslint-plugin-svelte
      // v3 (and its svelte-eslint-parser dependency) are ESM-only packages
      // that ship flat config exports exclusively.
      if (useFlatConfig(tree)) {
        const eslintConfigPath = `apps/my-app/eslint.config.mjs`;
        expect(tree.exists(eslintConfigPath)).toBeTruthy();
        const eslintConfig = tree.read(eslintConfigPath, 'utf-8');
        expect(eslintConfig).toContain('eslint-plugin-svelte');
      } else {
        expect(tree.exists(`apps/my-app/.eslintrc.json`)).toBeTruthy();
      }
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

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await applicationGenerator(tsSolutionTree, options);

      expect(tsSolutionTree.exists('apps/my-app/project.json')).toBe(false);
      expect(tsSolutionTree.exists('apps/my-app/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'apps/my-app/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/my-app');
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('apps');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './apps/my-app' }]),
      );
    });

    it('wires the runtime tsconfig.app.json to extend tsconfig.base.json directly, with bundler resolution', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const tsconfigApp = readJson(
        tsSolutionTree,
        'apps/my-app/tsconfig.app.json',
      );
      expect(tsconfigApp.extends).toBe('../../tsconfig.base.json');
      // `moduleResolution: 'bundler'`/`module: 'esnext'` are already declared
      // on the root tsconfig.base.json (createTsSolutionTree) -
      // updateTsconfigFiles' getNeededCompilerOptionOverrides correctly
      // omits them here as redundant instead of duplicating the inherited
      // value, so assert against the base directly.
      const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
      expect(tsconfigBase.compilerOptions.moduleResolution).toBe('bundler');
      expect(tsconfigBase.compilerOptions.module).toBe('esnext');
      // resolveJsonModule is NOT set on the base, so it must show up here.
      expect(tsconfigApp.compilerOptions.resolveJsonModule).toBe(true);
    });
  });
});
