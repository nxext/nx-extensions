module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    '../../.eslintrc.json',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['svelte3', '@typescript-eslint'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts', '*.js', '*.svelte'],
      parserOptions: {
        project: ['e2e/docstsconfig.*?.json'],
      },
      rules: {},
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {},
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': require('typescript'),
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
