import type { Linter } from 'eslint';

export const extraEslintDependencies = {
  dependencies: {},
  devDependencies: {
    'eslint-plugin-solid': '^0.1.2',
  },
};

export const extendSolidEslintJson = (json: Linter.Config) => {
  const { plugins: pluginPlugins, ...config } = json;

  return {
    plugins: ['solid', ...(pluginPlugins || [])],
    ...config,
  };
};
