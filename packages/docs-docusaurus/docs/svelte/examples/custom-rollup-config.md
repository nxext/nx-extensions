---
id: custom-rollup-config
title: Custom rollup config
---

The build option `rollupConfig` takes the path to a function which takes a rollup config and SvelteBuildOptions object and returns an updated rollup configuration. This allows to update the default rollup configuration and to add or remove plugins.

```js
module.exports = (config, options) => {

  const production = options.prod;
  const predefinedPluginsToExclude = ['svelte'];

  config.output.file = 'some/output/path/file.js'
  
  let filteredPredefinedPlugins = config.plugins.filter(plugin => !predefinedPluginsToExclude.includes(plugin?.name));

  let myPlugins = [
    ...filteredPredefinedPlugins,
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
        customElement: true
      }
    }),
  ];
    
  return {
    ...config,
    plugins: myPlugins,
  };
}

```

