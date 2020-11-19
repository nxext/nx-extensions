import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { getProjectConfig, ProjectType, readJsonInTree } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { fileListForAppType, runSchematic } from '../../utils/testing';
import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';

describe('schematic:library', () => {
  let tree: Tree;
  const options: InitSchema = { name: 'test' };

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('lib', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should create files', async () => {
    const appName = 'test';
    const result = await runSchematic(
      'lib',
      { name: appName, appType: AppType.library },
      tree
    );

    const fileList = fileListForAppType(appName, SupportedStyles.css, ProjectType.Library);
    fileList.forEach((file) => expect(result.exists(file)));
  });

  it('should create files in specified dir', async () => {
    const appName = 'testlib';
    const result = await runSchematic(
      'lib',
      { name: appName, appType: AppType.library, subdir: 'subdir' },
      tree
    );

    const fileList = fileListForAppType(
      appName,
      SupportedStyles.css,
      ProjectType.Library,
      'subdir'
    );
    fileList.forEach((file) => expect(result.exists(file)));
  });

  it('should add Stencil Library dependencies', async () => {
    const result = await runSchematic('lib', { name: 'test' }, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  Object.keys(SupportedStyles).forEach((style) => {
    it(`should add Stencil ${style} dependencies to lib`, async () => {
      const result = await runSchematic(
        'lib',
        { name: 'test', style: style },
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

  describe('default libraries', () => {
    let options;
    let projectName;
    beforeEach(() => {
      projectName = 'testlib';
      options = { name: projectName, appType: AppType.library };
    });

    it('shouldnt create build targets if not buildable', async () => {
      const result = await runSchematic('lib', options, tree);

      const projectConfig = getProjectConfig(result, projectName);
      expect(projectConfig.architect['build']).toBeUndefined();
      expect(projectConfig.architect['e2e']).toBeUndefined();
      expect(projectConfig.architect['serve']).toBeUndefined();
    });

    it('should export component', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.readContent('libs/testlib/src/components.d.ts')).toContain(
        "export * from './components/my-component/my-component';"
      );
    });

    it('shouldnt create build files', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(result.exists('libs/testlib/src/index.html')).toBeFalsy();
      expect(result.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });

  describe('buildable libraries', () => {
    let options;
    let projectName;
    beforeEach(() => {
      projectName = 'testlib';
      options = {
        name: projectName,
        appType: AppType.library,
        buildable: true,
      };
    });

    it('should create build targets', async () => {
      const projectName = 'testlib';
      const result = await runSchematic('lib', options, tree);

      const projectConfig = getProjectConfig(result, projectName);
      expect(projectConfig.architect['build']).toBeDefined();
      expect(projectConfig.architect['e2e']).toBeDefined();
      expect(projectConfig.architect['serve']).toBeDefined();
    });

    it('should export bundle', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.readContent('libs/testlib/src/index.ts')).toContain(
        "export * from './components';"
      );
    });

    it('should create build files', async () => {
      const result = await runSchematic('lib', options, tree);

      expect(result.exists('libs/testlib/stencil.config.ts')).toBeTruthy();
      expect(result.exists('libs/testlib/src/index.html')).toBeTruthy();
      expect(result.exists('libs/testlib/src/components.d.ts')).toBeTruthy();
    });
  });
});
