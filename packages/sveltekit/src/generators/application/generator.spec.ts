import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { useFlatConfig } from '@nx/eslint/internal';

import { applicationGenerator } from './generator';
import { SveltekitGeneratorSchema } from './schema';

describe('sveltekit generator', () => {
  let tree: Tree;
  const options: SveltekitGeneratorSchema = {
    name: 'test',
    skipFormat: false,
    linter: 'eslint',
    unitTestRunner: 'none',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('should run successfully', async () => {
    await applicationGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });

  it('should wire up eslint-plugin-svelte (flat config) or skip gracefully (legacy config)', async () => {
    await applicationGenerator(tree, options);

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['eslint-plugin-svelte']).toBeDefined();
    expect(
      packageJson.devDependencies['eslint-plugin-svelte3']
    ).toBeUndefined();

    if (useFlatConfig(tree)) {
      const eslintConfigPath = `test/eslint.config.mjs`;
      expect(tree.exists(eslintConfigPath)).toBeTruthy();
      const eslintConfig = tree.read(eslintConfigPath, 'utf-8');
      expect(eslintConfig).toContain('eslint-plugin-svelte');
    } else {
      expect(tree.exists(`test/.eslintrc.json`)).toBeTruthy();
    }
  });
});
