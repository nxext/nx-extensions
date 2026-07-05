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
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['package.json', 'generators.json'],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: ['package.json'],
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
  })),
];
