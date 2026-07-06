import { PreactApplicationSchema } from './schema';
import { applicationGenerator } from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { createTsSolutionTree } from '@nxext/common';

describe('Preact app schematic', () => {
  let host: Tree;
  const options: PreactApplicationSchema = {
    directory: 'apps/test',
    linter: 'eslint',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(host, { ...options });
      expect(host.exists(`apps/test/public/index.html`)).toBeFalsy();
      expect(host.exists(`apps/test/index.html`)).toBeTruthy();
    });
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await applicationGenerator(tsSolutionTree, options);

      expect(tsSolutionTree.exists('apps/test/project.json')).toBe(false);
      expect(tsSolutionTree.exists('apps/test/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'apps/test/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/test');
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('apps');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './apps/test' }]),
      );
    });

    it('wires the runtime tsconfig.app.json to extend tsconfig.base.json directly, with preact JSX + bundler resolution', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const tsconfigApp = readJson(
        tsSolutionTree,
        'apps/test/tsconfig.app.json',
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
      // resolveJsonModule and the preact-specific JSX settings are NOT set
      // on the base, so they must show up here.
      expect(tsconfigApp.compilerOptions.resolveJsonModule).toBe(true);
      expect(tsconfigApp.compilerOptions.jsx).toBe('preserve');
      expect(tsconfigApp.compilerOptions.jsxFactory).toBe('h');
      expect(tsconfigApp.compilerOptions.jsxFragmentFactory).toBe('Fragment');
      expect(tsconfigApp.compilerOptions.jsxImportSource).toBe('preact');
    });

    it('keeps the per-project wrapper tsconfig.json free of baked-in JSX compilerOptions', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const tsconfigJson = readJson(tsSolutionTree, 'apps/test/tsconfig.json');
      // No compilerOptions at all: the ts-solution template starts as a
      // thin references-only pointer (the JSX/module settings live on the
      // runtime tsconfig.app.json instead, via `wireTsSolutionProject`).
      expect(tsconfigJson.compilerOptions).toBeUndefined();
      // The generated template only seeds a reference to tsconfig.app.json;
      // `@nx/jest`'s own configuration generator (unrelated to TS-solution -
      // it does the same in legacy mode) unconditionally appends
      // tsconfig.spec.json too, ending up with the same two references the
      // legacy wrapper template already hardcodes.
      expect(tsconfigJson.references).toEqual(
        expect.arrayContaining([
          { path: './tsconfig.app.json' },
          { path: './tsconfig.spec.json' },
        ]),
      );
    });
  });
});
