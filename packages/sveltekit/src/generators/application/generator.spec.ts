import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { useFlatConfig } from '@nx/eslint/internal';
import { createTsSolutionTree } from '@nxext/common';

import { applicationGenerator } from './generator';
import { SveltekitGeneratorSchema } from './schema';

describe('sveltekit generator', () => {
  let tree: Tree;
  const options: SveltekitGeneratorSchema = {
    name: 'test',
    skipFormat: false,
    linter: 'eslint',
    unitTestRunner: 'none',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await applicationGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });

  it('should wire up eslint-plugin-svelte (flat config) or skip gracefully (legacy config)', async () => {
    await applicationGenerator(tree, options);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['eslint-plugin-svelte']).toBeDefined();
    expect(
      packageJson.devDependencies['eslint-plugin-svelte3'],
    ).toBeUndefined();

    if (useFlatConfig(tree)) {
      const eslintConfigPath = `test/eslint.config.mjs`;
      expect(tree.exists(eslintConfigPath)).toBeTruthy();
      const eslintConfig = tree.read(eslintConfigPath, 'utf-8');
      expect(eslintConfig).toContain('eslint-plugin-svelte');
    } else {
      expect(tree.exists(`test/.eslintrc.json`)).toBeTruthy();
    }
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await applicationGenerator(tsSolutionTree, options);

      expect(tsSolutionTree.exists('test/project.json')).toBe(false);
      expect(tsSolutionTree.exists('test/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'test/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/test');
      // sveltekit's schema requires an explicit `name`, so (unlike svelte
      // without --name) the Nx project name stays the bare name and gets
      // recorded via nx.name since it differs from the import path.
      expect(packageJson.nx.name).toBe('test');
      // svelte.config.js is ESM (`export default`) and its filename is a
      // fixed SvelteKit convention, so the project package.json must declare
      // `type: "module"` (in legacy mode the static package.json template
      // does this).
      expect(packageJson.type).toBe('module');
      // The check/add targets move onto package.json's nx.targets in
      // package.json-backed projects.
      expect(packageJson.nx.targets.check).toBeDefined();
      expect(packageJson.nx.targets.add).toBeDefined();
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('test');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './test' }]),
      );
    });

    it('writes a thin references-only wrapper tsconfig.json instead of the legacy svelte compilerOptions', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const wrapperTsconfig = readJson(tsSolutionTree, 'test/tsconfig.json');
      // The legacy wrapper bakes in `importsNotUsedAsValues` (removed in
      // TS >= 5.5) and `moduleResolution: node` - none of that may leak
      // into a TS-solution workspace.
      expect(wrapperTsconfig.compilerOptions).toBeUndefined();
      expect(wrapperTsconfig.files).toEqual([]);
      expect(wrapperTsconfig.references).toEqual(
        expect.arrayContaining([
          { path: './tsconfig.app.json' },
          { path: './tsconfig.spec.json' },
        ]),
      );
    });

    it('wires the runtime tsconfig.app.json to extend tsconfig.base.json directly, with bundler resolution', async () => {
      await applicationGenerator(tsSolutionTree, options);

      const tsconfigApp = readJson(tsSolutionTree, 'test/tsconfig.app.json');
      expect(tsconfigApp.extends).toBe('../tsconfig.base.json');
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
