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
      'packages/stencil/**/*.ts',
      'packages/stencil/**/*.tsx',
      'packages/stencil/**/*.js',
      'packages/stencil/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/stencil/**/*.ts', 'packages/stencil/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/stencil/**/*.js', 'packages/stencil/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/stencil/package.json',
      'packages/stencil/generators.json',
      'packages/stencil/executors.json',
      'packages/stencil/generators.json',
      'packages/stencil/executors.json',
      'packages/stencil/migrations.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
