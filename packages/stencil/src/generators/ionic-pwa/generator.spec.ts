import { ProjectType } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType } from '../../utils/devkit/testing';
import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { ionicPwaGenerator } from './generator';

describe('schematic:ionic-pwa', () => {
  let tree: Tree;
  const options: InitSchema = { name: 'test', style: SupportedStyles.css, appType: AppType.pwa };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should create files', async () => {
    const appName = 'testpwa';
    await ionicPwaGenerator(tree, options)

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application
    );
    fileList.forEach((file) => expect(tree.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const appName = 'testpwa';
    await ionicPwaGenerator(tree, { name: appName, appType: AppType.pwa, directory: 'subdir' });

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application,
      'subdir'
    );
    fileList.forEach((file) => expect(tree.exists(file)));
  });

  it('should add Stencil/Ionic PWA dependencies', async () => {
    await ionicPwaGenerator(tree, options);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to pwa`, async () => {
      await ionicPwaGenerator(tree, { name: 'test', style: SupportedStyles[style] });
      const packageJson = readJson(tree, 'package.json');
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
      await ionicPwaGenerator(tree, { name: projectName, style: SupportedStyles[style], appType: AppType.application });

      const projectConfig = readProjectConfiguration(tree, projectName);
      expect(projectConfig.generators).toEqual({
        '@nxext/stencil:component': {
          style: style
        },
      });
    });
  });
});
