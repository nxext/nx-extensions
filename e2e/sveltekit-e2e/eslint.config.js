const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'e2e/sveltekit-e2e/**/*.ts',
      'e2e/sveltekit-e2e/**/*.tsx',
      'e2e/sveltekit-e2e/**/*.js',
      'e2e/sveltekit-e2e/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['e2e/sveltekit-e2e/**/*.ts', 'e2e/sveltekit-e2e/**/*.tsx'],
    rules: {},
  },
  {
    files: ['e2e/sveltekit-e2e/**/*.js', 'e2e/sveltekit-e2e/**/*.jsx'],
    rules: {},
  },
];
