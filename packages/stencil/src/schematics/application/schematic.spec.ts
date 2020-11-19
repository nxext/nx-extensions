import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { getProjectConfig, ProjectType, readJsonInTree } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType, runSchematic } from '../../utils/testing';
import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';

describe('schematic:application', () => {
  let tree: Tree;
  const options: InitSchema = { name: 'test' };

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('application', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should add Stencil dependencies', async () => {
    const result = await runSchematic(
      'app',
      { name: 'test', appType: AppType.application },
      tree
    );
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  it('should create files', async () => {
    const appName = 'testapp';
    const result = await runSchematic(
      'app',
      { name: appName, appType: AppType.application },
      tree
    );

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application
    );
    fileList.forEach((file) => expect(result.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const appName = 'testapp';
    const result = await runSchematic(
      'app',
      { name: appName, appType: AppType.application, subdir: 'subdir' },
      tree
    );

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Application,
      'subdir'
    );
    fileList.forEach((file) => expect(result.exists(file)));
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to application`, async () => {
      const result = await runSchematic(
        'app',
        { name: 'test', style: style, appType: AppType.application },
        tree
      );
      const packageJson = readJsonInTree(result, 'package.json');
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

      tree = await runSchematic(
        'app',
        { name: projectName, style: style, appType: AppType.application },
        tree
      );

      const projectConfig = getProjectConfig(tree, projectName);
      expect(projectConfig.schematics).toEqual({
        '@nxext/stencil:component': {
          style: style,
          storybook: false,
        },
      });
    });
  });
});
