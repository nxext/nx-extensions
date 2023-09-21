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
      'packages/sveltekit/**/*.ts',
      'packages/sveltekit/**/*.tsx',
      'packages/sveltekit/**/*.js',
      'packages/sveltekit/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/sveltekit/**/*.ts', 'packages/sveltekit/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/sveltekit/**/*.js', 'packages/sveltekit/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/sveltekit/package.json',
      'packages/sveltekit/generators.json',
      'packages/sveltekit/executors.json',
      'packages/sveltekit/generators.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
