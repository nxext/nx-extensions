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
];
