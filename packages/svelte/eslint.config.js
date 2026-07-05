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
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['package.json', 'generators.json', 'migrations.json'],
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
    files: ['package.json'],
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
