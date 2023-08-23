import {
  eslintPluginNuxtConfigTypescript,
  eslintPluginPrettierVueVersion,
  eslintPluginTypescriptVueVersion,
  eslintPluginVueVersion,
} from './versions';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    '@nuxtjs/eslint-config-typescript': eslintPluginNuxtConfigTypescript,
    'eslint-plugin-vue': eslintPluginVueVersion,
    '@vue/eslint-config-prettier': eslintPluginPrettierVueVersion,
    '@vue/eslint-config-typescript': eslintPluginTypescriptVueVersion,
  },
};

export const extendNextEslintJson = (json: any) => {
  const { extends: pluginExtends, ...config } = json;

  return {
    extends: [
      'eslint:recommended',
      '@nuxtjs/eslint-config-typescript',
      'plugin:vue/vue3-essential',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting',
      ...(pluginExtends || []),
    ],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
    ...config,
  };
};
