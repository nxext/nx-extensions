const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const js = require('@eslint/js');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});
module.exports = [
  ...baseConfig,
  {
    files: [
      'packages/vue/**/*.ts',
      'packages/vue/**/*.tsx',
      'packages/vue/**/*.js',
      'packages/vue/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/vue/**/*.ts', 'packages/vue/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/vue/**/*.js', 'packages/vue/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/vue/package.json',
      'packages/vue/generators.json',
      'packages/vue/executors.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
