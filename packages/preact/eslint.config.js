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
    files: ['package.json', 'generators.json'],
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
          // @nx/web and @nx/cypress are no longer imported directly - the
          // application generator now calls into @nxext/common's
          // addCypressApplication, which declares them as its own
          // peerDependencies. They stay listed here as peerDependencies
          // because they are part of the public contract of @nxext/preact
          // (what a consuming workspace must have installed), not just an
          // implementation detail of which package imports them.
          ignoredDependencies: ['@nx/web', '@nx/cypress'],
        },
      ],
    },
  },
];
