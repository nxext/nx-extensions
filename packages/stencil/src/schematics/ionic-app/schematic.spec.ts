import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { runSchematic, SUPPORTED_STYLE_LIBRARIES } from '../../utils/testing';

describe('schematic:ionic-app', () => {
  let tree: Tree;
  const options = { name: 'test', appTemplate: "Tabs"};

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('ionic-app', options, tree)
    ).resolves.not.toThrowError();
  });

  it('should add Stencil/Ionic App dependencies', async () => {
    const result = await runSchematic('ionic-app', options, tree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeDefined();
  });

  SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
    it(`should add Stencil ${style} dependencies to ionic-app`, async () => {
      const result = await runSchematic(
        'ionic-app',
        { ...options, style: style },
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


});
