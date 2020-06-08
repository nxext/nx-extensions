import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { STYLE_PLUGIN_DEPENDENCIES } from '../../utils/typings';
import { runSchematic, SUPPORTED_STYLE_LIBRARIES } from '../../utils/testing';
import { CoreSchema } from '../core/schema';

describe('stencil schematic', () => {
  let appTree: Tree;
  const options: CoreSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('lib', options, appTree)
    ).resolves.not.toThrowError();
  });

  it('should add Stencil Library dependencies', async () => {
    const result = await runSchematic('lib', { name: 'test' }, appTree);
    const packageJson = readJsonInTree(result, 'package.json');
    expect(packageJson.devDependencies['@stencil/core']).toBeDefined();
    expect(packageJson.devDependencies['@ionic/core']).toBeUndefined();
  });

  SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
    it(`should add Stencil ${style} dependencies to lib`, async () => {
      const result = await runSchematic(
        'lib',
        { name: 'test', style: style },
        appTree
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
