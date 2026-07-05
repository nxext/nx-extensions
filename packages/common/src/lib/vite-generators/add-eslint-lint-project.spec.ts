import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { addProjectConfiguration, readJson, Tree, writeJson } from '@nx/devkit';
import { addEslintLintProject } from './add-eslint-lint-project';

describe('addEslintLintProject', () => {
  let tree: Tree;
  const extraDependencies = {
    dependencies: {},
    devDependencies: { 'eslint-config-preact': '^1.2.0' },
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    addProjectConfiguration(tree, 'my-app', {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      projectType: 'application',
      targets: {},
    });
    writeJson(tree, 'apps/my-app/tsconfig.app.json', { compilerOptions: {} });
  });

  it('is a no-op when linter is not eslint (preact/solid add-linting.ts guard)', async () => {
    const task = await addEslintLintProject(
      tree,
      {
        linter: 'none',
        projectName: 'my-app',
        projectRoot: 'apps/my-app',
        tsConfigFileName: 'tsconfig.app.json',
      },
      extraDependencies
    );

    expect(typeof task).toBe('function');
    const packageJson = readJson(tree, 'package.json');
    expect(
      packageJson.devDependencies?.['eslint-config-preact']
    ).toBeUndefined();
  });

  it('lints the project, deletes the (legacy) per-project .eslintrc.json and installs the extra dependencies', async () => {
    // NB: byte-identical to preact/solid's App add-linting.ts today —
    // verified against the unmodified packages/preact source. Against the
    // Nx version pinned in this workspace, `lintProjectGenerator` no longer
    // emits an `eslintrc.js` (only `.eslintrc.json` in legacy mode, or a
    // flat `eslint.config.*`), so the historical
    // `rename(eslintrc.js -> .eslintrc.js)` never finds a source file and
    // the subsequent `delete('.eslintrc.json')` removes the file
    // `lintProjectGenerator` just created — leaving no per-project eslint
    // config behind. This is a pre-existing characteristic of the App
    // generators under the currently installed `@nx/eslint`, reproduced
    // here on purpose (not "fixed").
    await addEslintLintProject(
      tree,
      {
        linter: 'eslint',
        projectName: 'my-app',
        projectRoot: 'apps/my-app',
        tsConfigFileName: 'tsconfig.app.json',
      },
      extraDependencies
    );

    expect(tree.exists('apps/my-app/.eslintrc.js')).toBeFalsy();
    expect(tree.exists('apps/my-app/eslintrc.js')).toBeFalsy();
    expect(tree.exists('apps/my-app/.eslintrc.json')).toBeFalsy();
    expect(tree.exists('apps/my-app/eslint.config.mjs')).toBeFalsy();

    // the root-level lint init/setup still ran
    expect(tree.exists('.eslintrc.json')).toBeTruthy();

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['eslint-config-preact']).toBe('^1.2.0');
  });
});
