import { Tree } from '@angular-devkit/schematics';

import { getProjectConfig, readJsonInTree } from '@nrwl/workspace';
import { createTestUILib, runSchematic } from '../../../utils/testing';

describe('init', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = Tree.empty();
    appTree = await createTestUILib('test-ui-lib', 'scss');
  });

  describe('dependencies for package.json', () => {
    it('should add related dependencies', async () => {
      const tree = await runSchematic(
        'storybook-init',
        { name: 'test-ui-lib' },
        appTree
      );
      const packageJson = readJsonInTree(tree, 'package.json');

      // general deps
      expect(packageJson.devDependencies['@nrwl/storybook']).toBeDefined();
      expect(packageJson.dependencies['@nrwl/storybook']).toBeUndefined();
      expect(
        packageJson.devDependencies['@storybook/addon-knobs']
      ).toBeDefined();

      expect(packageJson.devDependencies['@storybook/html']).toBeDefined();
    });
  });

  it('should add build-storybook to cacheable operations', async () => {
    const tree = await runSchematic(
      'storybook-init',
      { name: 'test-ui-lib' },
      appTree
    );
    const nxJson = readJsonInTree(tree, 'nx.json');
    expect(
      nxJson.tasksRunnerOptions.default.options.cacheableOperations
    ).toContain('build-storybook');
  });

  it('should generate files', async () => {
    const tree = await runSchematic(
      'storybook-init',
      { name: 'test-ui-lib' },
      appTree
    );

    expect(tree.exists('libs/test-ui-lib/.storybook/addons.js')).toBeTruthy();
    expect(tree.exists('libs/test-ui-lib/.storybook/config.ts')).toBeTruthy();
    expect(
      tree.exists('libs/test-ui-lib/.storybook/tsconfig.json')
    ).toBeTruthy();
    expect(
      tree.exists('libs/test-ui-lib/.storybook/webpack.config.js')
    ).toBeTruthy();

    expect(tree.exists('.storybook/addons.js')).toBeTruthy();
    expect(tree.exists('.storybook/tsconfig.json')).toBeTruthy();
    expect(tree.exists('.storybook/webpack.config.js')).toBeTruthy();
  });

  it('should update workspace file', async () => {
    const tree = await runSchematic(
      'storybook-init',
      { name: 'test-ui-lib' },
      appTree
    );
    const project = getProjectConfig(tree, 'test-ui-lib');

    expect(project.architect.storybook).toEqual({
      builder: '@nrwl/storybook:storybook',
      configurations: {
        ci: {
          quiet: true,
        },
      },
      options: {
        port: 4400,
        uiFramework: '@storybook/html',
        config: {
          configFolder: 'libs/test-ui-lib/.storybook',
        },
      },
    });
  });

  it('should update `tsconfig.json` file', async () => {
    const tree = await runSchematic(
      'storybook-init',
      { name: 'test-ui-lib' },
      appTree
    );
    const tsconfigLibJson = readJsonInTree(
      tree,
      'libs/test-ui-lib/tsconfig.json'
    );
    expect(tsconfigLibJson.exclude.includes('**/*.stories.ts')).toBeTruthy();
  });

  it('should update component defaults', async () => {
    const tree = await runSchematic(
      'storybook-init',
      { name: 'test-ui-lib' },
      appTree
    );
    const workspaceJson = readJsonInTree(tree, 'workspace.json');
    expect(
      workspaceJson.projects['test-ui-lib'].schematics[
        '@nxext/stencil:component'
      ]
    ).toEqual({
      style: 'scss',
      storybook: true,
    });
  });
});
