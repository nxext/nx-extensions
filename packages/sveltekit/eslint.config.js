const baseConfig = require('../../eslint.config.js');
const jsoncEslintParser = require('jsonc-eslint-parser');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {},
  },
  {
    files: [
      'package.json',
      'generators.json',
      'executors.json',
      'generators.json',
    ],
    languageOptions: { parser: jsoncEslintParser },
    rules: { '@nx/nx-plugin-checks': 'error' },
  },
];
