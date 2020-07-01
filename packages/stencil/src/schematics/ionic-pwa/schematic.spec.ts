import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { getProjectConfig, readJsonInTree } from '@nrwl/workspace';
import { AppType, STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { runSchematic, SUPPORTED_STYLE_LIBRARIES } from '../../utils/testing';
import { CoreSchema } from '../core/schema';

describe('schematic:ionic-pwa', () => {
  let tree: Tree;
  const options: CoreSchema = { name: 'test' };

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('pwa', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should add Stencil/Ionic PWA dependencies', async () => {
    const result = await runSchematic('pwa', options, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
    it(`should add Stencil ${style} dependencies to pwa`, async () => {
      const result = await runSchematic(
        'pwa',
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

  SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
    it(`should add component config for ${style} to workspace config`, async () => {
      const projectName = 'test';

      tree = await runSchematic(
        'app',
        { name: projectName, style: style, appType: AppType.Application },
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
