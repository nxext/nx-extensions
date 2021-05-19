import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/testing';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { applicationGenerator } from './generator';
import { ProjectType } from '@nrwl/workspace';

describe('schematic:application', () => {
  let host: Tree;

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace();
  });

  it('should add Stencil dependencies', async () => {
    await applicationGenerator(host, { name: 'test', appType: AppType.application });
    const packageJson = readJson(host, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    const appName = 'testapp';
    await applicationGenerator(host, { name: appName, appType: AppType.application });

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const appName = 'testapp';
    await applicationGenerator(host, { name: appName, appType: AppType.application, directory: 'subdir' });

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application,
      'subdir'
    );
    fileList.forEach((file) => expect(host.exists(file)));
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to application`, async () => {
      await applicationGenerator(host, { name: 'test', style: SupportedStyles[style], appType: AppType.application });
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
      await applicationGenerator(host, { name: projectName, style: SupportedStyles[style], appType: AppType.application });

      const projectConfig = readProjectConfiguration(host, projectName);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style
        },
      });
    });
  });
});
