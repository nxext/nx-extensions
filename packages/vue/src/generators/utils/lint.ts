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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extendVueEslintJson = (json: any) => {
  const { extends: pluginExtends, ...config } = json;

  return {
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting',
      ...(pluginExtends || []),
    ],
    ...config,
  };
};
