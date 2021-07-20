module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  babelDefault: (config) => {
    return {
      ...config,
      plugins: [
        ...config.plugins,
        [
          require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }, 'preset'
        ]
      ]
    };
  }
};
