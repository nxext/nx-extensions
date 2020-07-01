import { Tree } from '@angular-devkit/schematics';
import { createTestUILib, runSchematic } from '../../../utils/testing';

describe('schematic:configuration', () => {
  let appTree: Tree;

  beforeEach(async () => {
    appTree = await createTestUILib('test-ui-lib');
  });

  it('should generate files', async () => {
    const tree = await runSchematic(
      'storybook-configuration',
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
});
