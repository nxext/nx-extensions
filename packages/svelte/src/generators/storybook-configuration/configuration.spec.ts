import {
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '@nx/js';

import configurationGenerator from './configuration';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

xdescribe('@nxext/svelte:storybook-configuration', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    await libraryGenerator(tree, {
      name: 'test-ui-lib',
    });
  });

  it('should generate files', async () => {
    await configurationGenerator(tree, {
      name: 'test-ui-lib',
      standaloneConfig: false,
    });

    // Root
    expect(tree.exists('.storybook/main.js')).toBeTruthy();

    // Local
    expect(
      tree.exists('libs/test-ui-lib/.storybook/tsconfig.json')
    ).toBeTruthy();
    expect(tree.exists('libs/test-ui-lib/.storybook/main.js')).toBeTruthy();
    expect(tree.exists('libs/test-ui-lib/.storybook/preview.js')).toBeTruthy();

    const storybookTsconfigJson = readJson<{ exclude: string[] }>(
      tree,
      'libs/test-ui-lib/.storybook/tsconfig.json'
    );

    expect(
      storybookTsconfigJson.exclude.includes('../**/*.spec.ts')
    ).toBeTruthy();
    expect(
      storybookTsconfigJson.exclude.includes('../**/*.spec.tsx')
    ).toBeFalsy();
    expect(
      storybookTsconfigJson.exclude.includes('../**/*.spec.js')
    ).toBeFalsy();
    expect(
      storybookTsconfigJson.exclude.includes('../**/*.spec.jsx')
    ).toBeFalsy();
  });

  it('should not update root files after generating them once', async () => {
    await configurationGenerator(tree, {
      name: 'test-ui-lib',
      standaloneConfig: false,
    });

    const newContents = `module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials', 'new-addon'],
};
`;
    // Setup a new lib
    await libraryGenerator(tree, {
      name: 'test-ui-lib-2',
    });

    tree.write('.storybook/main.js', newContents);
    await configurationGenerator(tree, {
      name: 'test-ui-lib-2',
      standaloneConfig: false,
    });

    expect(tree.read('.storybook/main.js', 'utf-8')).toEqual(newContents);
  });

  it('should update workspace file for libs', async () => {
    // Setup a new lib
    await libraryGenerator(tree, {
      name: 'test-ui-lib-2',
    });
    await configurationGenerator(tree, {
      name: 'test-ui-lib-2',
      standaloneConfig: false,
    });
    const project = readProjectConfiguration(tree, 'test-ui-lib-2');

    expect(project.targets.storybook).toEqual({
      executor: '@nx/storybook:storybook',
      configurations: {
        ci: {
          quiet: true,
        },
      },
      options: {
        port: 4400,
        uiFramework: '@storybook/svelte',
        configDir: 'libs/test-ui-lib-2/.storybook',
      },
    });

    expect(project.targets.lint).toEqual({
      executor: '@nx/linter:eslint',
      outputs: ['{options.outputFile}'],
      options: {
        lintFilePatterns: ['libs/test-ui-lib-2/**/*.ts'],
      },
    });
  });

  it('should update `tsconfig.lib.json` file', async () => {
    await configurationGenerator(tree, {
      name: 'test-ui-lib',
      standaloneConfig: false,
    });
    const tsconfigJson = readJson(tree, 'libs/test-ui-lib/tsconfig.lib.json');

    expect(tsconfigJson.exclude).toContain('**/*.stories.ts');
    expect(tsconfigJson.exclude).toContain('**/*.stories.js');
  });
});
