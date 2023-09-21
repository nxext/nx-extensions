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
      'packages/ionic-react/**/*.ts',
      'packages/ionic-react/**/*.tsx',
      'packages/ionic-react/**/*.js',
      'packages/ionic-react/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/ionic-react/**/*.ts', 'packages/ionic-react/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/ionic-react/**/*.js', 'packages/ionic-react/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'packages/ionic-react/package.json',
      'packages/ionic-react/generators.json',
      'packages/ionic-react/executors.json',
      'packages/ionic-react/generators.json',
      'packages/ionic-react/executors.json',
      'packages/ionic-react/migrations.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
