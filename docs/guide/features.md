# Features

At the very basic level, developing using Vite is not that much different from using a static file server. However, Vite provides many enhancements over native ESM imports to support various features that are typically seen in bundler-based setups.

## NPM Dependency Resolving and Pre-Bundling

Native ES imports do not support bare module imports like the following:

```js
import { someMethod } from 'my-dep';
```

The above will throw an error in the browser. Vite will detect such bare module imports in all served source files and perform the following:

1. [Pre-bundle](./dep-pre-bundling) them to improve page loading speed and convert CommonJS / UMD modules to ESM. The pre-bundling step is performed with [esbuild](http://esbuild.github.io/) and makes Vite's cold start time significantly faster than any JavaScript-based bundler.

2. Rewrite the imports to valid URLs like `/node_modules/.vite/my-dep.js?v=f3sf2ebd` so that the browser can import them properly.

**Dependencies are Strongly Cached**

Vite caches dependency requests via HTTP headers, so if you wish to locally edit/debug a dependency, follow the steps [here](./dep-pre-bundling#browser-cache).

## Hot Module Replacement

Vite provides an [HMR API](./api-hmr) over native ESM. Frameworks with HMR capabilities can leverage the API to provide instant, precise updates without reloading the page or blowing away application state. Vite provides first-party HMR integrations for [Vue Single File Components](https://github.com/vitejs/vite/tree/main/packages/plugin-vue) and [React Fast Refresh](https://github.com/vitejs/vite/tree/main/packages/plugin-react). There are also official integrations for Preact via [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Note you don't need to manually set these up - when you [create an app via `create-vite`](./), the selected templates would have these pre-configured for you already.

## TypeScript

Vite supports importing `.ts` files out of the box.

Vite only performs transpilation on `.ts` files and does **NOT** perform type checking. It assumes type checking is taken care of by your IDE and build process (you can run `tsc --noEmit` in the build script or install `vue-tsc` and run `vue-tsc --noEmit` to also type check your `*.vue` files).

Vite uses [esbuild](https://github.com/evanw/esbuild) to transpile TypeScript into JavaScript which is about 20~30x faster than vanilla `tsc`, and HMR updates can reflect in the browser in under 50ms.

Use the [Type-Only Imports and Export](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) syntax to avoid potential problems like type-only imports being incorrectly bundled. for example:

```ts
import type { T } from 'only/types';
export type { T };
```

### TypeScript Compiler Options

Some configuration fields under `compilerOptions` in `tsconfig.json` require special attention.

#### `isolatedModules`

Should be set to `true`.

It is because `esbuild` only performs transpilation without type information, it doesn't support certain features like const enum and implicit type-only imports.

You must set `"isolatedModules": true` in your `tsconfig.json` under `compilerOptions`, so that TS will warn you against the features that do not work with isolated transpilation.

#### `useDefineForClassFields`

Starting from Vite 2.5.0, the default value will be `true` if the TypeScript target is `ESNext`. It is consistent with the [behavior of `tsc` 4.3.2 and later](https://github.com/microsoft/TypeScript/pull/42663). It is also the standard ECMAScript runtime behavior.

But it may be counter-intuitive for those coming from other programming languages or older versions of TypeScript.
You can read more about the transition in the [TypeScript 3.7 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

If you are using a library that heavily relies on class fields, please be careful about the library's intended usage of it.

Most libraries expect `"useDefineForClassFields": true`, such as [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties), [Vue Class Components 8.x](https://github.com/vuejs/vue-class-component/issues/465), etc.

But a few libraries haven't transitioned to this new default yet, including [`lit-element`](https://github.com/lit/lit-element/issues/1030). Please explicitly set `useDefineForClassFields` to `false` in these cases.

#### Other Compiler Options Affecting the Build Result

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)

If migrating your codebase to `"isolatedModules": true` is an unsurmountable effort, you may be able to get around it with a third-party plugin such as [rollup-plugin-friendly-type-imports](https://www.npmjs.com/package/rollup-plugin-friendly-type-imports). However, this approach is not officially supported by Vite.

### Client Types

Vite's default types are for its Node.js API. To shim the environment of client side code in a Vite application, add a `d.ts` declaration file:

```typescript
/// <reference types="vite/client" />
```

Also, you can add `vite/client` to `compilerOptions.types` of your `tsconfig`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

This will provide the following type shims:

- Asset imports (e.g. importing an `.svg` file)
- Types for the Vite-injected [env variables](./env-and-mode#env-variables) on `import.meta.env`
- Types for the [HMR API](./api-hmr) on `import.meta.hot`

## Vue

Vite provides first-class Vue support:

- Vue 3 SFC support via [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)
- Vue 3 JSX support via [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx)
- Vue 2 support via [underfin/vite-plugin-vue2](https://github.com/underfin/vite-plugin-vue2)

## JSX

`.jsx` and `.tsx` files are also supported out of the box. JSX transpilation is also handled via [esbuild](https://esbuild.github.io), and defaults to the React 16 flavor. React 17 style JSX support in esbuild is tracked [here](https://github.com/evanw/esbuild/issues/334).

Vue users should use the official [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx) plugin, which provides Vue 3 specific features including HMR, global component resolving, directives and slots.

If not using JSX with React or Vue, custom `jsxFactory` and `jsxFragment` can be configured using the . For example for Preact:

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
});
```

More details in [esbuild docs](https://esbuild.github.io/content-types/#jsx).

You can inject the JSX helpers using `jsxInject` (which is a Vite-only option) to avoid manual imports:

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
```

## CSS

Importing `.css` files will inject its content to the page via a `<style>` tag with HMR support. You can also retrieve the processed CSS as a string as the module's default export.

### `@import` Inlining and Rebasing

Vite is pre-configured to support CSS `@import` inlining via `postcss-import`. Vite aliases are also respected for CSS `@import`. In addition, all CSS `url()` references, even if the imported files are in different directories, are always automatically rebased to ensure correctness.

`@import` aliases and URL rebasing are also supported for Sass and Less files (see [CSS Pre-processors](#css-pre-processors)).

### PostCSS

If the project contains valid PostCSS config (any format supported by [postcss-load-config](https://github.com/postcss/postcss-load-config), e.g. `postcss.config.js`), it will be automatically applied to all imported CSS.

### CSS Modules

Any CSS file ending with `.module.css` is considered a [CSS modules file](https://github.com/css-modules/css-modules). Importing such a file will return the corresponding module object:

```css
/* example.module.css */
.red {
  color: red;
}
```

```js
import classes from './example.module.css';
document.getElementById('foo').className = classes.red;
```



If `css.modules.localsConvention` is set to enable camelCase locals (e.g. `localsConvention: 'camelCaseOnly'`), you can also use named imports:

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css';
document.getElementById('foo').className = applyColor;
```

### CSS Pre-processors

Because Vite targets modern browsers only, it is recommended to use native CSS variables with PostCSS plugins that implement CSSWG drafts (e.g. [postcss-nesting](https://github.com/jonathantneal/postcss-nesting)) and author plain, future-standards-compliant CSS.

That said, Vite does provide built-in support for `.scss`, `.sass`, `.less`, `.styl` and `.stylus` files. There is no need to install Vite-specific plugins for them, but the corresponding pre-processor itself must be installed:

```bash
# .scss and .sass
npm add -D sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

If using Vue single file components, this also automatically enables `<style lang="sass">` et al.

Vite improves `@import` resolving for Sass and Less so that Vite aliases are also respected. In addition, relative `url()` references inside imported Sass/Less files that are in different directories from the root file are also automatically rebased to ensure correctness.

`@import` alias and url rebasing are not supported for Stylus due to its API constraints.

You can also use CSS modules combined with pre-processors by prepending `.module` to the file extension, for example `style.module.scss`.

## Static Assets

Importing a static asset will return the resolved public URL when it is served:

```js
import imgUrl from './img.png';
document.getElementById('hero-img').src = imgUrl;
```

Special queries can modify how assets are loaded:

```js
// Explicitly load assets as URL
import assetAsURL from './asset.js?url';
```

```js
// Load assets as strings
import assetAsString from './shader.glsl?raw';
```

```js
// Load Web Workers
import Worker from './worker.js?worker';
```

```js
// Web Workers inlined as base64 strings at build time
import InlineWorker from './worker.js?worker&inline';
```

More details in [Static Asset Handling](./assets).

## JSON

JSON files can be directly imported - named imports are also supported:

```js
// import the entire object
import json from './example.json';
// import a root field as named exports - helps with tree-shaking!
import { field } from './example.json';
```

## Glob Import

Vite supports importing multiple modules from the file system via the special `import.meta.glob` function:

```js
const modules = import.meta.glob('./dir/*.js');
```

The above will be transformed into the following:

```js
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
};
```

You can then iterate over the keys of the `modules` object to access the corresponding modules:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod);
  });
}
```

Matched files are by default lazy loaded via dynamic import and will be split into separate chunks during build. If you'd rather import all the modules directly (e.g. relying on side-effects in these modules to be applied first), you can use `import.meta.globEager` instead:

```js
const modules = import.meta.globEager('./dir/*.js');
```

The above will be transformed into the following:

```js
// code produced by vite
import * as __glob__0_0 from './dir/foo.js';
import * as __glob__0_1 from './dir/bar.js';
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
};
```

`import.meta.glob` and `import.meta.globEager` also support importing files as strings, similar to [Importing Asset as String](https://vitejs.dev/guide/assets.html#importing-asset-as-string). Here, we use the [Import Assertions](https://github.com/tc39/proposal-import-assertions#synopsis) syntax to import.

```js
const modules = import.meta.glob('./dir/*.js', { assert: { type: 'raw' } });
```

The above will be transformed into the following:

```js
// code produced by vite
const modules = {
  './dir/foo.js': '{\n  "msg": "foo"\n}\n',
  './dir/bar.js': '{\n  "msg": "bar"\n}\n',
};
```

Note that:

- This is a Vite-only feature and is not a web or ES standard.
- The glob patterns are treated like import specifiers: they must be either relative (start with `./`) or absolute (start with `/`, resolved relative to project root).
- The glob matching is done via `fast-glob` - check out its documentation for [supported glob patterns](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- You should also be aware that glob imports do not accept variables, you need to directly pass the string pattern.
- The glob patterns cannot contain the same quote string (i.e. `'`, `"`, `` ` ``) as outer quotes, e.g. `'/Tom\'s files/**'`, use `"/Tom's files/**"` instead.

## WebAssembly

Pre-compiled `.wasm` files can be directly imported - the default export will be an initialization function that returns a Promise of the exports object of the wasm instance:

```js
import init from './example.wasm';

init().then((exports) => {
  exports.test();
});
```

The init function can also take the `imports` object which is passed along to `WebAssembly.instantiate` as its second argument:

```js
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
});
```

In the production build, `.wasm` files smaller than `assetInlineLimit` will be inlined as base64 strings. Otherwise, they will be copied to the dist directory as an asset and fetched on-demand.

## Web Workers

A web worker script can be directly imported by appending `?worker` or `?sharedworker` to the import request. The default export will be a custom worker constructor:

```js
import MyWorker from './worker?worker';

const worker = new MyWorker();
```

The worker script can also use `import` statements instead of `importScripts()` - note during dev this relies on browser native support and currently only works in Chrome, but for the production build it is compiled away.

By default, the worker script will be emitted as a separate chunk in the production build. If you wish to inline the worker as base64 strings, add the `inline` query:

```js
import MyWorker from './worker?worker&inline';
```

## Build Optimizations

> Features listed below are automatically applied as part of the build process and there is no need for explicit configuration unless you want to disable them.

### CSS Code Splitting

Vite automatically extracts the CSS used by modules in an async chunk and generates a separate file for it. The CSS file is automatically loaded via a `<link>` tag when the associated async chunk is loaded, and the async chunk is guaranteed to only be evaluated after the CSS is loaded to avoid [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

If you'd rather have all the CSS extracted into a single file, you can disable CSS code s

### Preload Directives Generation

Vite automatically generates `<link rel="modulepreload">` directives for entry chunks and their direct imports in the built HTML.

### Async Chunk Loading Optimization

In real world applications, Rollup often generates "common" chunks - code that is shared between two or more other chunks. Combined with dynamic imports, it is quite common to have the following scenario:

![graph](/images/graph.png)

In the non-optimized scenarios, when async chunk `A` is imported, the browser will have to request and parse `A` before it can figure out that it also needs the common chunk `C`. This results in an extra network roundtrip:

```
Entry ---> A ---> C
```

Vite automatically rewrites code-split dynamic import calls with a preload step so that when `A` is requested, `C` is fetched **in parallel**:

```
Entry ---> (A + C)
```

It is possible for `C` to have further imports, which will result in even more roundtrips in the un-optimized scenario. Vite's optimization will trace all the direct imports to completely eliminate the roundtrips regardless of import depth.
