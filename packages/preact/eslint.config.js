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
      'packages/preact/**/*.ts',
      'packages/preact/**/*.tsx',
      'packages/preact/**/*.js',
      'packages/preact/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/preact/**/*.ts', 'packages/preact/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/preact/**/*.js', 'packages/preact/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['packages/preact/package.json', 'packages/preact/generators.json'],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
