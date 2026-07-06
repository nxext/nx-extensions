import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { RawApplicationSchema } from './schema';
import {
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { applicationGenerator } from './generator';
import {
  beginningOfEsLintConfigJsEsm,
  getEsLintPluginBaseName,
} from '../../utils/lint';
import { eslintImportPlugin, stencilEslintPlugin } from '../../utils/versions';
import { useFlatConfig } from '@nx/eslint/internal';
import { createTsSolutionTree } from '@nxext/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');
// `@nx/js`'s TS-solution tsconfig wiring (`getNeededCompilerOptionOverrides`,
// invoked via `wireTsSolutionProject`) resolves the TypeScript compiler
// through this SAME `ensurePackage` export, synchronously, and dereferences
// the result immediately (`ts.readConfigFile(...)`) - unlike every other
// caller in this spec, which only awaits/discards the return value. Keep the
// broad `Promise.resolve()` stub for everything else, but let `'typescript'`
// through to the real implementation so that path keeps working.
const actualEnsurePackage = jest.requireActual('@nx/devkit').ensurePackage;

describe('schematic:application', () => {
  jest
    .spyOn(devkit, 'ensurePackage')
    .mockImplementation((pkg: string, ...rest: unknown[]) =>
      pkg === 'typescript'
        ? actualEnsurePackage(pkg, ...rest)
        : Promise.resolve(),
    );
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('17.0.0');

  let host: Tree;
  const options: RawApplicationSchema = {
    directory: 'apps/test',
    linter: 'none',
  };
  const projectName = options.directory.replace('apps/', '');

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '^20.0.0',
      };
      return json;
    });
  });

  it('should add tags to project.json', async () => {
    await applicationGenerator(host, { ...options, tags: 'e2etag,e2ePackage' });

    const projectConfig = readProjectConfiguration(host, projectName);
    expect(projectConfig.tags).toEqual(['e2etag', 'e2ePackage']);
  });

  it('should add Stencil dependencies', async () => {
    await applicationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@types/node']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    await applicationGenerator(host, { ...options });

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'application',
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should configure lint target', async () => {
    // `@nx/eslint`'s `useFlatConfig()` falls back to the *installed* `eslint`
    // major version whenever the virtual tree has no root flat config file
    // (see `@nx/eslint/dist/src/utils/flat-config.js`). This workspace now
    // runs ESLint 9, so pin the legacy mode explicitly to keep this
    // characterization of the (still supported) eslintrc output
    // deterministic regardless of the host's ESLint version.
    process.env.ESLINT_USE_FLAT_CONFIG = 'false';

    await applicationGenerator(host, { ...options, linter: 'eslint' });

    const projectConfig = readProjectConfiguration(host, projectName);
    const eslintConfigPath = 'apps/test/.eslintrc.json';

    expect(useFlatConfig()).toBeFalsy();
    expect(projectConfig.targets.lint).toBeDefined();
    expect(host.exists(eslintConfigPath)).toBeTruthy();

    const eslintJson = readJson(host, eslintConfigPath);

    expect(eslintJson.extends).toEqual([
      `plugin:${getEsLintPluginBaseName(stencilEslintPlugin)}/recommended`,
      `plugin:${getEsLintPluginBaseName(eslintImportPlugin)}/recommended`,
      `plugin:${getEsLintPluginBaseName(eslintImportPlugin)}/typescript`,
      '../../.eslintrc.json',
    ]);

    delete process.env.ESLINT_USE_FLAT_CONFIG;
  });

  it('should configure lint target with flat config', async () => {
    // Pin flat-config mode explicitly (see comment above) so this
    // characterization stays deterministic regardless of the host's ESLint
    // version.
    process.env.ESLINT_USE_FLAT_CONFIG = 'true';

    await applicationGenerator(host, { ...options, linter: 'eslint' });

    const projectConfig = readProjectConfiguration(host, projectName);
    // Nx's flat-config generators default to the `.mjs` extension, not `.js`.
    const eslintConfigPath = 'apps/test/eslint.config.mjs';

    expect(useFlatConfig()).toBeTruthy();
    expect(projectConfig.targets.lint).toBeDefined();
    expect(host.exists(eslintConfigPath)).toBeTruthy();

    const eslintConfigJs = host.read(eslintConfigPath, 'utf-8');
    // The generated root config is an ES module (`export default [...]`), so
    // `augmentStencilEslintFlatConfig` emits the matching ESM import form
    // rather than the CJS `beginningOfEsLintConfigJs` constant.
    expect(eslintConfigJs).toContain(beginningOfEsLintConfigJsEsm);
    expect(eslintConfigJs).toContain('* stencilPlugin.flatConfigs.recommended');
    expect(eslintConfigJs).toContain('importPlugin.flatConfigs.recommended,');
    expect(eslintConfigJs).toContain('importPlugin.flatConfigs.typescript,');
    expect(eslintConfigJs).toContain("'import/no-unresolved': 'off',");

    delete process.env.ESLINT_USE_FLAT_CONFIG;
  });

  it('should create files in specified dir', async () => {
    await applicationGenerator(host, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'application',
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to application`, async () => {
      await applicationGenerator(host, {
        ...options,
        style: SupportedStyles[style],
      });

      const packageJson = readJson(host, 'package.json');
      expect(packageJson.devDependencies['@stencil/core']).toBeDefined();

      const styleDependencies = STYLE_PLUGIN_DEPENDENCIES[style];
      for (const devDependenciesKey in styleDependencies.devDependencies) {
        expect(packageJson.devDependencies[devDependenciesKey]).toBeDefined();
      }
    });
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      await applicationGenerator(host, {
        ...options,
        style: SupportedStyles[style],
      });

      const projectConfig = readProjectConfiguration(host, projectName);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style,
        },
      });
    });
  });

  it(`shouldn't create spec files if unitTestrunner is 'none'`, async () => {
    await applicationGenerator(host, { ...options, unitTestRunner: 'none' });

    expect(
      host.exists(`apps/test/src/components/app-home/app-home.spec.ts`),
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-root/app-root.spec.ts`),
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-profile/app-profile.spec.ts`),
    ).toBeFalsy();
  });

  it(`shouldn't create e2e files if e2eTestRunner is 'none'`, async () => {
    await applicationGenerator(host, { ...options, e2eTestRunner: 'none' });

    expect(
      host.exists(`apps/test/src/components/app-home/app-home.e2e.ts`),
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-root/app-root.e2e.ts`),
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-profile/app-profile.e2e.ts`),
    ).toBeFalsy();
  });

  it(`creates e2e files when e2eTestRunner is 'puppeteer'`, async () => {
    await applicationGenerator(host, {
      ...options,
      e2eTestRunner: 'puppeteer',
    });

    expect(
      host.exists(`apps/test/src/components/app-home/app-home.e2e.ts`),
    ).toBeTruthy();
    expect(
      host.exists(`apps/test/src/components/app-root/app-root.e2e.ts`),
    ).toBeTruthy();
    expect(
      host.exists(`apps/test/src/components/app-profile/app-profile.e2e.ts`),
    ).toBeTruthy();
  });

  it("declares the jest@29 line Stencil's own `test --e2e` requires when e2eTestRunner is puppeteer", async () => {
    await applicationGenerator(host, {
      ...options,
      e2eTestRunner: 'puppeteer',
    });

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies.jest).toBe('^29.0.0');
    expect(packageJson.devDependencies['jest-cli']).toBe('^29.0.0');
    expect(packageJson.devDependencies['@types/jest']).toBe('^29.0.0');
  });

  describe('TS-solution mode', () => {
    let tsSolutionTree: Tree;
    // `normalizeOptions` mutates whatever options object it's given
    // (`options.name ??= ...`) - the shared top-level `options` const is
    // passed directly (not spread) by earlier tests in this file (e.g.
    // 'should add Stencil dependencies'), which permanently poisons it with
    // `name: 'test'` for the rest of the suite. Use an entirely independent
    // literal here instead of deriving from `options`.
    let tsOptions: RawApplicationSchema;

    beforeEach(() => {
      tsSolutionTree = createTsSolutionTree();
      tsOptions = { directory: 'apps/test', linter: 'none' };
    });

    it('writes a package.json instead of a project.json, named after the import path', async () => {
      await applicationGenerator(tsSolutionTree, tsOptions);

      expect(tsSolutionTree.exists('apps/test/project.json')).toBe(false);
      expect(tsSolutionTree.exists('apps/test/package.json')).toBe(true);

      const packageJson = readJson(tsSolutionTree, 'apps/test/package.json');
      // determineProjectNameAndRootOptions derives the import path from the
      // workspace npm scope (`@proj`, from createTsSolutionTree's root
      // package.json) + the directory basename.
      expect(packageJson.name).toBe('@proj/test');
      // The Nx project identifier itself also becomes the importPath
      // (Design 1.5) since no explicit `--name` was given, so no `nx.name`
      // override is necessary (unlike `nx.targets`/`nx.generators`, which
      // are always written - see the dedicated test below).
      expect(packageJson.nx?.name).toBeUndefined();
    });

    it('registers the project in pnpm-workspace.yaml and adds a root tsconfig.json reference', async () => {
      await applicationGenerator(tsSolutionTree, tsOptions);

      const workspaceYaml = tsSolutionTree.read('pnpm-workspace.yaml', 'utf-8');
      expect(workspaceYaml).toContain('apps');

      const rootTsconfig = readJson(tsSolutionTree, 'tsconfig.json');
      expect(rootTsconfig.references).toEqual(
        expect.arrayContaining([{ path: './apps/test' }]),
      );
    });

    it('wires the runtime tsconfig.app.json to extend tsconfig.base.json directly, keeping Stencil-specific JSX compilerOptions', async () => {
      await applicationGenerator(tsSolutionTree, tsOptions);

      const tsconfigApp = readJson(
        tsSolutionTree,
        'apps/test/tsconfig.app.json',
      );
      expect(tsconfigApp.extends).toBe('../../tsconfig.base.json');
      // Stencil's own JSX pragma (`h`), not React/Solid's JSX runtime
      // conventions (Design 3.3).
      expect(tsconfigApp.compilerOptions.jsx).toBe('react');
      expect(tsconfigApp.compilerOptions.jsxFactory).toBe('h');
      // `moduleResolution` differs from the base's `bundler` default, so it
      // must be kept explicitly rather than stripped as redundant.
      expect(tsconfigApp.compilerOptions.moduleResolution).toBe('node');
    });

    it('keeps the outer tsconfig.json a thin references-only wrapper (no baked-in compilerOptions)', async () => {
      await applicationGenerator(tsSolutionTree, tsOptions);

      const tsconfigJson = readJson(tsSolutionTree, 'apps/test/tsconfig.json');
      expect(tsconfigJson.compilerOptions).toBeUndefined();
      expect(tsconfigJson.references).toEqual([{ path: './tsconfig.app.json' }]);
    });

    it("uses the plain, scope-free project name for Stencil's own generated values", async () => {
      await applicationGenerator(tsSolutionTree, tsOptions);

      const stencilConfig = tsSolutionTree
        .read('apps/test/stencil.config.ts')
        .toString('utf-8');
      // Not `https://@proj/test.local/` - the npm scope must never leak into
      // Stencil's own generated config values.
      expect(stencilConfig).toContain("baseUrl: 'https://test.local/'");
    });

    it('patches the lint target + component-generator defaults onto package.json.nx (no project.json)', async () => {
      await applicationGenerator(tsSolutionTree, { ...tsOptions, linter: 'eslint' });

      const packageJson = readJson(tsSolutionTree, 'apps/test/package.json');
      expect(packageJson.nx.targets.lint).toBeDefined();
      expect(packageJson.nx.generators).toEqual({
        '@nxext/stencil:component': {
          style: SupportedStyles.css,
        },
      });
    });
  });
});
