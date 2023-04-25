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
import { Linter } from '@nx/linter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../../utils/utillities');

describe('schematic:application', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

  let host: Tree;
  const options: RawApplicationSchema = { name: 'test', linter: Linter.None };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nx/workspace': '15.7.0',
      };
      return json;
    });
  });

  it('should add tags to nx.json', async () => {
    await applicationGenerator(host, { ...options, tags: 'e2etag,e2ePackage' });

    const projectConfig = readProjectConfiguration(host, options.name);
    expect(projectConfig.tags).toEqual(['e2etag', 'e2ePackage']);
  });

  it('should add Stencil dependencies', async () => {
    await applicationGenerator(host, options);

    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    await applicationGenerator(host, { ...options, linter: Linter.EsLint });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      'application'
    );
    fileList.forEach((file) => expect(host.exists(file)));

    const eslintJson = readJson(host, 'apps/test/.eslintrc.json');
    expect(eslintJson.extends).toEqual([
      'plugin:@stencil/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      '../../.eslintrc.json',
    ]);
  });

  it('should create files in specified dir', async () => {
    await applicationGenerator(host, { ...options, directory: 'subdir' });

    const fileList = fileListForAppType(
      options.name,
      SupportedStyles.css,
      'application',
      'subdir'
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

      const projectConfig = readProjectConfiguration(host, options.name);
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
