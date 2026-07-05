const baseConfig = require('../../eslint.config.js');
const jsoncEslintParser = require('jsonc-eslint-parser');

module.exports = [
  ...baseConfig,
  { rules: {} },
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
      'migrations.json',
    ],
    languageOptions: { parser: jsoncEslintParser },
    rules: { '@nx/nx-plugin-checks': 'error' },
  },
  {
    files: ['package.json'],
    languageOptions: { parser: jsoncEslintParser },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          buildTargets: ['build'],
          // Only imported via non-public subpaths (@stencil/core/cli,
          // /compiler, /internal, /sys/node) that the checker can't map
          // back to the base package.
          ignoredDependencies: ['@stencil/core'],
        },
      ],
    },
  },
];
