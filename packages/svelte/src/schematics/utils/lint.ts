import { eslintPluginSvelteVersion } from './versions';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-svelte3': eslintPluginSvelteVersion,
  },
};

export const svelteEslintJson = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  plugins: ['import', 'jsx-a11y', 'react', 'react-hooks']
};
