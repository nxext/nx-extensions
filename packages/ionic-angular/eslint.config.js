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
      'packages/ionic-angular/**/*.ts',
      'packages/ionic-angular/**/*.tsx',
      'packages/ionic-angular/**/*.js',
      'packages/ionic-angular/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: [
      'packages/ionic-angular/**/*.ts',
      'packages/ionic-angular/**/*.tsx',
    ],
    rules: {},
  },
  {
    files: [
      'packages/ionic-angular/**/*.js',
      'packages/ionic-angular/**/*.jsx',
    ],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/ionic-angular/package.json',
      'packages/ionic-angular/generators.json',
      'packages/ionic-angular/executors.json',
      'packages/ionic-angular/generators.json',
      'packages/ionic-angular/executors.json',
      'packages/ionic-angular/migrations.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
