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
      'packages/nuxt/**/*.ts',
      'packages/nuxt/**/*.tsx',
      'packages/nuxt/**/*.js',
      'packages/nuxt/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/nuxt/**/*.ts', 'packages/nuxt/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/nuxt/**/*.js', 'packages/nuxt/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/nuxt/package.json',
      'packages/nuxt/generators.json',
      'packages/nuxt/executors.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
