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
          // @nx/web, @nx/cypress and @nx/jest are no longer imported
          // directly - the generator core now calls into @nxext/common
          // (addCypressApplication/addJestConfiguration/addJestInitPlugin/
          // addCypressInitPlugin), which declares them as its own
          // peerDependencies. They stay listed here as dependencies because
          // they are part of the public contract of @nxext/solid (what a
          // consuming workspace must have installed), not just an
          // implementation detail of which package imports them.
          ignoredDependencies: ['@nx/web', '@nx/cypress', '@nx/jest'],
        },
      ],
    },
  },
];
