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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');

describe('schematic:application', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
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
});
