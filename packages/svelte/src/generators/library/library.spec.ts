import { SvelteLibrarySchema } from './schema';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './library';
import { useFlatConfig } from '@nx/eslint/internal';
import { createTsSolutionTree } from '@nxext/common';

describe('svelte library schematic', () => {
  let tree;
  const options: SvelteLibrarySchema = {
    directory: 'libs/my-lib',
    linter: 'eslint',
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
  });

  it('should wire up eslint-plugin-svelte (flat config) or skip gracefully (legacy config)', async () => {
    await libraryGenerator(tree, options);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['eslint-plugin-svelte']).toBeDefined();
    expect(
      packageJson.devDependencies['eslint-plugin-svelte3'],
    ).toBeUndefined();

    if (useFlatConfig(tree)) {
      const eslintConfigPath = `libs/my-lib/eslint.config.mjs`;
      expect(tree.exists(eslintConfigPath)).toBeTruthy();
      const eslintConfig = tree.read(eslintConfigPath, 'utf-8');
      expect(eslintConfig).toContain('eslint-plugin-svelte');
    } else {
      expect(tree.exists(`libs/my-lib/.eslintrc.json`)).toBeTruthy();
    }
  });

  it('should fail if no importPath is provided with publishable', async () => {
    try {
      await libraryGenerator(tree, {
        ...options,
        publishable: true,
      });
    } catch (error) {
      expect(error.message).toContain(
        'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)',
      );
    }
  });

  it('registers the import path in tsconfig.base.json', async () => {
    await libraryGenerator(tree, options);
    const tsconfigBase = readJson(tree, 'tsconfig.base.json');
    expect(tsconfigBase.compilerOptions.paths).toBeDefined();
    // determineProjectNameAndRootOptions derives the import path from the
    // workspace npm scope (empty in createTreeWithEmptyWorkspace) + the
    // project name, yielding '@proj/my-lib'.
    expect(tsconfigBase.compilerOptions.paths['@proj/my-lib']).toEqual([
      './libs/my-lib/src/index.ts',
    ]);
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

  it('should configure a vitest test target when unitTestRunner is vitest and the lib is not buildable/publishable', async () => {
    await libraryGenerator(tree, {
      ...options,
      unitTestRunner: 'vitest',
    });
    const { targets } = readProjectConfiguration(tree, 'my-lib');
    expect(targets.test.executor).toBe('@nx/vitest:test');
    expect(tree.exists('libs/my-lib/vite.config.ts')).toBeTruthy();
  });

  it('should configure a vitest test target when unitTestRunner is vitest and the lib is buildable', async () => {
    await libraryGenerator(tree, {
      ...options,
      unitTestRunner: 'vitest',
      buildable: true,
    });
    const { targets } = readProjectConfiguration(tree, 'my-lib');
    expect(targets.test.executor).toBe('@nx/vitest:test');
    expect(tree.exists('libs/my-lib/vite.config.ts')).toBeTruthy();
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await libraryGenerator(tsSolutionTree, options);

      expect(tsSolutionTree.exists('libs/my-lib/project.json')).toBe(false);
      expect(tsSolutionTree.exists('libs/my-lib/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'libs/my-lib/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/my-lib');
    });

    it('points a non-buildable lib package.json straight at its source (no dist step)', async () => {
      await libraryGenerator(tsSolutionTree, options);

      const packageJson = readJson(tsSolutionTree, 'libs/my-lib/package.json');
      expect(packageJson.main).toBe('./src/index.ts');
      expect(packageJson.exports['.']).toEqual({
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      });
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await libraryGenerator(tsSolutionTree, options);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('libs');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './libs/my-lib' }]),
      );
    });

    it('wires the runtime tsconfig.lib.json to extend tsconfig.base.json directly, with bundler resolution', async () => {
      await libraryGenerator(tsSolutionTree, options);

      const tsconfigLib = readJson(
        tsSolutionTree,
        'libs/my-lib/tsconfig.lib.json',
      );
      expect(tsconfigLib.extends).toBe('../../tsconfig.base.json');
      // `moduleResolution: 'bundler'`/`module: 'esnext'` are already declared
      // on the root tsconfig.base.json (createTsSolutionTree) -
      // updateTsconfigFiles' getNeededCompilerOptionOverrides correctly
      // omits them here as redundant instead of duplicating the inherited
      // value, so assert against the base directly.
      const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
      expect(tsconfigBase.compilerOptions.moduleResolution).toBe('bundler');
      expect(tsconfigBase.compilerOptions.module).toBe('esnext');
      // resolveJsonModule is NOT set on the base, so it must show up here.
      expect(tsconfigLib.compilerOptions.resolveJsonModule).toBe(true);
    });

    it('does not register a tsconfig.base.json paths entry (workspace symlinks resolve cross-project imports instead)', async () => {
      await libraryGenerator(tsSolutionTree, options);

      const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
      expect(
        tsconfigBase.compilerOptions.paths?.['@proj/my-lib'],
      ).toBeUndefined();
    });
  });
});
