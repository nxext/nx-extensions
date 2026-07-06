import { PreactLibrarySchema } from './schema';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from './library';
import { createTsSolutionTree } from '@nxext/common';

describe('preact library schematic', () => {
  let host;
  const options: PreactLibrarySchema = {
    directory: 'libs/test',
    linter: 'eslint',
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
    buildable: true,
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should add preact project files', async () => {
    await libraryGenerator(host, options);
    expect(host.exists(`libs/test/project.json`)).toBeTruthy();
    expect(host.exists(`libs/test/package.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.lib.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.spec.json`)).toBeTruthy();
    expect(host.exists(`libs/test/tsconfig.json`)).toBeTruthy();
  });

  it('should not add package.json file when not buildable and publishable', async () => {
    await libraryGenerator(host, {
      ...options,
      buildable: false,
      publishable: false,
    });
    expect(host.exists(`libs/test/package.json`)).toBeFalsy();
  });

  it('should add preact dependencies', async () => {
    await libraryGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['preact']).toBeDefined();
  });

  it('should add lint config file', async () => {
    // `@nx/eslint`'s `useFlatConfig()` falls back to the *installed* `eslint`
    // major version whenever the virtual tree has no root flat config file
    // (see `@nx/eslint/dist/src/utils/flat-config.js`). This workspace now
    // runs ESLint 9, so pin the legacy mode explicitly to keep this
    // characterization deterministic regardless of the host's ESLint version.
    const originalEslintUseFlatConfig = process.env.ESLINT_USE_FLAT_CONFIG;
    process.env.ESLINT_USE_FLAT_CONFIG = 'false';
    try {
      await libraryGenerator(host, options);
      expect(host.exists(`libs/test/eslint.config.js`)).toBeFalsy();
      expect(host.exists(`libs/test/.eslintrc.json`)).toBeTruthy();
    } finally {
      if (originalEslintUseFlatConfig === undefined) {
        delete process.env.ESLINT_USE_FLAT_CONFIG;
      } else {
        process.env.ESLINT_USE_FLAT_CONFIG = originalEslintUseFlatConfig;
      }
    }
  });

  it('should add lint config file for the flat config', async () => {
    /**
     * TODO: ESLINT_USE_FLAT_CONFIG might be unsupported in v21
     */
    // process.env.ESLINT_USE_FLAT_CONFIG = 'true';
    const originalEslintUseFlatConfig = process.env.ESLINT_USE_FLAT_CONFIG;
    process.env.ESLINT_USE_FLAT_CONFIG = 'false';
    try {
      await libraryGenerator(host, options);
      expect(host.exists(`libs/test/eslint.config.js`)).toBeFalsy();
      expect(host.exists(`libs/test/.eslintrc.json`)).toBeTruthy();
    } finally {
      if (originalEslintUseFlatConfig === undefined) {
        delete process.env.ESLINT_USE_FLAT_CONFIG;
      } else {
        process.env.ESLINT_USE_FLAT_CONFIG = originalEslintUseFlatConfig;
      }
    }
  });

  it('should configure a vitest test target when unitTestRunner is vitest', async () => {
    await libraryGenerator(host, {
      ...options,
      unitTestRunner: 'vitest',
      buildable: false,
      publishable: false,
    });
    const { targets } = readProjectConfiguration(host, 'test');
    expect(targets.test.executor).toBe('@nx/vitest:test');
    expect(host.exists('libs/test/vite.config.ts')).toBeTruthy();
  });

  it('should fail if no importPath is provided with publishable', async () => {
    try {
      await libraryGenerator(host, {
        ...options,
        publishable: true,
      });
    } catch (error) {
      expect(error.message).toContain(
        'For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)',
      );
    }
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await libraryGenerator(tsSolutionTree, {
        ...options,
        buildable: false,
        publishable: false,
      });

      expect(tsSolutionTree.exists('libs/test/project.json')).toBe(false);
      expect(tsSolutionTree.exists('libs/test/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'libs/test/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/test');
    });

    it('points a non-buildable lib package.json straight at its source (no dist step)', async () => {
      await libraryGenerator(tsSolutionTree, {
        ...options,
        buildable: false,
        publishable: false,
      });

      const packageJson = readJson(tsSolutionTree, 'libs/test/package.json');
      expect(packageJson.main).toBe('./src/index.ts');
      expect(packageJson.exports['.']).toEqual({
        types: './src/index.ts',
        import: './src/index.ts',
        default: './src/index.ts',
      });
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await libraryGenerator(tsSolutionTree, {
        ...options,
        buildable: false,
        publishable: false,
      });

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('libs');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './libs/test' }]),
      );
    });

    it('wires the runtime tsconfig.lib.json to extend tsconfig.base.json directly, with preact JSX + bundler resolution', async () => {
      await libraryGenerator(tsSolutionTree, {
        ...options,
        buildable: false,
        publishable: false,
      });

      const tsconfigLib = readJson(
        tsSolutionTree,
        'libs/test/tsconfig.lib.json',
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
      // resolveJsonModule and the preact-specific JSX settings are NOT set
      // on the base, so they must show up here.
      expect(tsconfigLib.compilerOptions.resolveJsonModule).toBe(true);
      expect(tsconfigLib.compilerOptions.jsx).toBe('preserve');
      expect(tsconfigLib.compilerOptions.jsxFactory).toBe('h');
      expect(tsconfigLib.compilerOptions.jsxFragmentFactory).toBe('Fragment');
      expect(tsconfigLib.compilerOptions.jsxImportSource).toBe('preact');
    });

    it('does not register a tsconfig.base.json paths entry (workspace symlinks resolve cross-project imports instead)', async () => {
      await libraryGenerator(tsSolutionTree, {
        ...options,
        buildable: false,
        publishable: false,
      });

      const tsconfigBase = readJson(tsSolutionTree, 'tsconfig.base.json');
      expect(
        tsconfigBase.compilerOptions.paths?.['@proj/test'],
      ).toBeUndefined();
    });
  });
});
