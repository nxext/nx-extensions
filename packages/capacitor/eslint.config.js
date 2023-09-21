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
      'packages/capacitor/**/*.ts',
      'packages/capacitor/**/*.tsx',
      'packages/capacitor/**/*.js',
      'packages/capacitor/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/capacitor/**/*.ts', 'packages/capacitor/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/capacitor/**/*.js', 'packages/capacitor/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/capacitor/package.json',
      'packages/capacitor/generators.json',
      'packages/capacitor/executors.json',
      'packages/capacitor/generators.json',
      'packages/capacitor/executors.json',
      'packages/capacitor/migrations.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
