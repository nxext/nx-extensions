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
      'packages/solid/**/*.ts',
      'packages/solid/**/*.tsx',
      'packages/solid/**/*.js',
      'packages/solid/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/solid/**/*.ts', 'packages/solid/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/solid/**/*.js', 'packages/solid/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['packages/solid/package.json', 'packages/solid/generators.json'],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
