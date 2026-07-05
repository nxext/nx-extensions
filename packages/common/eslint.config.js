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
    files: ['**/*.json'],
    languageOptions: { parser: jsoncEslintParser },
    rules: { '@nx/dependency-checks': 'error' },
  },
];
