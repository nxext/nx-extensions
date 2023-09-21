const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'e2e/capacitor-e2e/**/*.ts',
      'e2e/capacitor-e2e/**/*.tsx',
      'e2e/capacitor-e2e/**/*.js',
      'e2e/capacitor-e2e/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['e2e/capacitor-e2e/**/*.ts', 'e2e/capacitor-e2e/**/*.tsx'],
    rules: {},
  },
  {
    files: ['e2e/capacitor-e2e/**/*.js', 'e2e/capacitor-e2e/**/*.jsx'],
    rules: {},
  },
];
