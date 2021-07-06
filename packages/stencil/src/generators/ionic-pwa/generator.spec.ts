import { ProjectType } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ionicPwaGenerator } from './generator';
import { applicationGenerator } from '../application/generator';
import { RawPWASchema } from './schema';

describe('schematic:ionic-pwa', () => {
  let host: Tree;
  const options: RawPWASchema = { name: 'test', style: SupportedStyles.css, appType: AppType.pwa };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  it('should create files', async () => {
    const appName = 'testpwa';
    await ionicPwaGenerator(host, options)

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const appName = 'testpwa';
    await ionicPwaGenerator(host, { name: appName, appType: AppType.pwa, directory: 'subdir' });

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application,
      'subdir'
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should add Stencil/Ionic PWA dependencies', async () => {
    await ionicPwaGenerator(host, options);
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to pwa`, async () => {
      await ionicPwaGenerator(host, { name: 'test', style: SupportedStyles[style] });
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
      const projectName = 'test';
      await ionicPwaGenerator(host, { name: projectName, style: SupportedStyles[style], appType: AppType.application });

      const projectConfig = readProjectConfiguration(host, projectName);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style
        },
      });
    });
  });

  it(`shouldn't create spec files if unitTestrunner is 'none'`, async () => {
    await applicationGenerator(host, {...options, unitTestRunner: 'none'});

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
