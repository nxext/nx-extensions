---
id: svelte-config
title: Svelte config file
---

The build option `svelteConfig` takes the path for file with a svelte config. The config will be parsed and used as the parameter for the svelte-rollup-plugin.
```js
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
  compilerOptions: {
    dev: true,
  },

  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess()
};

```
