import { Linter } from 'eslint';
import {
  eslintPluginPrettierVueVersion,
  eslintPluginTypescriptVueVersion,
  eslintPluginVueVersion,
} from './versions';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-vue': eslintPluginVueVersion,
    '@vue/eslint-config-prettier': eslintPluginPrettierVueVersion,
    '@vue/eslint-config-typescript': eslintPluginTypescriptVueVersion,
  },
};

export const extendVueEslintJson = (json: Linter.Config) => {
  const { extends: pluginExtends, ...config } = json;

  return {
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier',
      ...(pluginExtends || []),
    ],
    ...config,
  };
};
