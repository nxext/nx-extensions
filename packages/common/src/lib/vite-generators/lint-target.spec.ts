import { createEslintLintTarget } from './lint-target';

describe('createEslintLintTarget', () => {
  it('creates the App lint target exactly like preact/solid/svelte do today (tsconfig.app.json)', () => {
    // Reference: preact/src/generators/application/lib/create-lint-target.ts,
    // solid/src/generators/application/lib/add-project.ts (inline
    // createLintTarget), svelte/src/generators/utils/targets.ts
    // (createLintTarget) — all three build the exact same shape.
    expect(createEslintLintTarget('apps/my-app', 'tsconfig.app.json')).toEqual({
      executor: '@nx/eslint:lint',
      options: {
        linter: 'eslint',
        tsConfig: 'apps/my-app/tsconfig.app.json',
        exclude: ['**/node_modules/**', '!apps/my-app/**/*'],
      },
    });
  });

  it('supports tsconfig.lib.json for a future Library caller', () => {
    expect(createEslintLintTarget('libs/my-lib', 'tsconfig.lib.json')).toEqual({
      executor: '@nx/eslint:lint',
      options: {
        linter: 'eslint',
        tsConfig: 'libs/my-lib/tsconfig.lib.json',
        exclude: ['**/node_modules/**', '!libs/my-lib/**/*'],
      },
    });
  });

  it('normalizes a root ("." ) projectRoot the same way joinPathFragments does', () => {
    const target = createEslintLintTarget('.', 'tsconfig.app.json');
    expect(target.options.tsConfig).toBe('tsconfig.app.json');
    expect(target.options.exclude).toEqual(['**/node_modules/**', '!**/*']);
  });
});
