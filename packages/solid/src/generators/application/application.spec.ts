import { Schema } from './schema';
import { applicationGenerator } from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { createTsSolutionTree } from '@nxext/common';

describe('Solid app generator', () => {
  let tree: Tree;
  const options: Schema = {
    directory: 'apps/my-app',
    linter: 'eslint',
    unitTestRunner: 'vitest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(tree, { ...options });
      expect(tree.exists(`apps/my-app/public/index.html`)).toBeFalsy();
      expect(tree.exists(`apps/my-app/index.html`)).toBeTruthy();
    });

    it('should add vite specific files as rootProject', async () => {
      await applicationGenerator(tree, {
        ...options,
        directory: '.',
        name: options.directory.replace('apps/', ''),
        rootProject: true,
      });
      expect(tree.exists(`public/index.html`)).toBeFalsy();
      expect(tree.exists(`index.html`)).toBeTruthy();
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

    it('wires the runtime tsconfig.app.json to extend tsconfig.base.json directly, with bundler resolution and Solid JSX support', async () => {
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
      // jsx/jsxImportSource aren't on the base either - and would otherwise
      // be silently lost, since `wireTsSolutionProject` repoints `extends`
      // straight at tsconfig.base.json, bypassing the per-project wrapper
      // tsconfig.json where these normally live for Solid's legacy mode.
      expect(tsconfigApp.compilerOptions.jsx).toBe('preserve');
      expect(tsconfigApp.compilerOptions.jsxImportSource).toBe('solid-js');
    });
  });
});
