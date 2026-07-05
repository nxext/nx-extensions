const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const js = require('@eslint/js');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});
module.exports = [
  ...baseConfig,
  { rules: {} },
  {
    files: [
      'packages/svelte/**/*.ts',
      'packages/svelte/**/*.tsx',
      'packages/svelte/**/*.js',
      'packages/svelte/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/svelte/**/*.ts', 'packages/svelte/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/svelte/**/*.js', 'packages/svelte/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/svelte/package.json',
      'packages/svelte/generators.json',
      'packages/svelte/migrations.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
  {
    // `@nx/web` and `@nx/cypress` are only consumed indirectly now: their
    // generators run through @nxext/common's `addCypressApplication`
    // (packages/common/src/lib/vite-generators/add-cypress.ts), which lazily
    // ensurePackage()s both. Since @nx/dependency-checks only counts direct,
    // statically-detectable imports in this project's own source (no
    // transitive resolution through @nxext/common), it would otherwise flag
    // both peerDependencies as obsolete even though a real Vite workspace
    // using @nxext/svelte's cypress e2e wiring still needs them installed.
    files: ['packages/svelte/package.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          buildTargets: ['build'],
          ignoredDependencies: ['@nx/web', '@nx/cypress'],
        },
      ],
    },
  },
];
