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
import { Linter } from '@nx/eslint';
import {
  beginningOfEsLintConfigJs,
  getEsLintPluginBaseName,
} from '../../utils/lint';
import { eslintImportPlugin, stencilEslintPlugin } from '../../utils/versions';
import { useFlatConfig } from '@nx/eslint/src/utils/flat-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');

describe('schematic:application', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('17.0.0');

  let host: Tree;
  const options: RawApplicationSchema = {
    name: 'test',
    directory: 'apps/test',
    linter: Linter.None,
  };
  const projectName = options.name;

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
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    await applicationGenerator(host, { ...options });

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'application'
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should configure lint target', async () => {
    await applicationGenerator(host, { ...options, linter: Linter.EsLint });

    const projectConfig = readProjectConfiguration(host, projectName);
    const eslintConfigPath = `apps/${projectName}/.eslintrc.json`;

    /**
     * useFlatConfig() should return false by default because in this repo we are utilizing eslint of version < 9.0.0
     * This test case will fail when migrate to eslint@^9.0.0 - add:
     *    - process.env.ESLINT_USE_FLAT_CONFIG = 'false'; -> at the beginning of this test case
     *    - delete process.env.ESLINT_USE_FLAT_CONFIG; -> at the end of this test case
     *
     * https://eslint.org/blog/2023/10/flat-config-rollout-plans/
     * Since eslint@^10.0.0, the legacy configuration will no longer be supported - remove this test case and align the generator code
     */
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
  });

  xit('should configure lint target with flat config', async () => {
    process.env.ESLINT_USE_FLAT_CONFIG = 'true';

    await applicationGenerator(host, { ...options, linter: Linter.EsLint });

    const projectConfig = readProjectConfiguration(host, projectName);
    const eslintConfigPath = `apps/${projectName}/eslint.config.js`;

    /**
     * useFlatConfig() should return false by default because in this repo we are utilizing eslint of version < 9.0.0
     * This works for now because of the overwritten value of process.env.ESLINT_USE_FLAT_CONFIG = 'true';
     *
     * When migrate to eslint@^9.0.0 do:
     *    - process.env.ESLINT_USE_FLAT_CONFIG = 'true'; - remove it from the beginning of this test case
     *    - delete process.env.ESLINT_USE_FLAT_CONFIG; - remove it from the beginning of this test case
     */
    expect(useFlatConfig()).toBeTruthy();
    expect(projectConfig.targets.lint).toBeDefined();
    expect(host.exists(eslintConfigPath)).toBeTruthy();

    const eslintConfigJs = host.read(eslintConfigPath, 'utf-8');

    expect(eslintConfigJs).toContain(beginningOfEsLintConfigJs);
    expect(eslintConfigJs).toContain('* stencilPlugin.flatConfigs.recommended');
    expect(eslintConfigJs).toContain('importPlugin.flatConfigs.recommended,');
    expect(eslintConfigJs).toContain('importPlugin.flatConfigs.typescript,');
    expect(eslintConfigJs).toContain(
      '* Having an empty rules object present makes it more obvious to the user where they would'
    );
    expect(eslintConfigJs).toContain('* extend things from if they needed to');

    delete process.env.ESLINT_USE_FLAT_CONFIG;
  });

  it('should create files in specified dir', async () => {
    await applicationGenerator(host, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.directory,
      SupportedStyles.css,
      'application'
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
      host.exists(`apps/test/src/components/app-home/app-home.spec.ts`)
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-root/app-root.spec.ts`)
    ).toBeFalsy();
    expect(
      host.exists(`apps/test/src/components/app-profile/app-profile.spec.ts`)
    ).toBeFalsy();
  });
});
