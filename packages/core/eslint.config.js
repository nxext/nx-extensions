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
      'packages/core/**/*.ts',
      'packages/core/**/*.tsx',
      'packages/core/**/*.js',
      'packages/core/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/core/**/*.ts', 'packages/core/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/core/**/*.js', 'packages/core/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['packages/core/**/*.json'],
    rules: { '@nx/dependency-checks': 'error' },
  })),
];
