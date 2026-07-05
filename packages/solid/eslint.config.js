const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../eslint.config.js');
const js = require('@eslint/js');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});
module.exports = [
  ...baseConfig,
  { rules: {} },
  {
    files: [
      'packages/solid/**/*.ts',
      'packages/solid/**/*.tsx',
      'packages/solid/**/*.js',
      'packages/solid/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['packages/solid/**/*.ts', 'packages/solid/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/solid/**/*.js', 'packages/solid/**/*.jsx'],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['packages/solid/package.json', 'packages/solid/generators.json'],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['packages/solid/package.json'],
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
  })),
];
