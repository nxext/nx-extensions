---
id: custom-preprocessor-config
title: Custom preprocessor config
---

The build option `sveltePreprocessConfig` takes the path for file with a function exported. This function will be evaluated and used as the Svelte preprocess options. The `options`parameter of the function include all build options from the builder. Youre able to access everything defined in the [builder](../builder/build). Additionally theres the field `projectRoot` with the path of the project relative to the Nx workspace root.  
```js
function setSveltePreprocessOptions(options) {
  return {
    postcss: {
      plugins: [
        require('postcss-import')(),
        require('postcss-nested')(), // Remove if you can't wan't to use nested structures.
        require('tailwindcss')(options.projectRoot + '/tailwind.config.js'),
      ]
    }
  };
}

module.exports = setSveltePreprocessOptions;
```
A example how to add TailwindCSS. 
