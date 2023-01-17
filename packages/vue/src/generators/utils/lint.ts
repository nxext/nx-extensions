import { Linter } from 'eslint';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-vue': '^9.3.0',
    '@vue/eslint-config-prettier': '^7.0.0',
    '@vue/eslint-config-typescript': '^11.0.2',
  },
};

export const extendReactEslintJson = (json: Linter.Config) => {
  const { extends: pluginExtends, ...config } = json;

  return {
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier',
      ...(pluginExtends || [])],
    ...config,
  };
};
