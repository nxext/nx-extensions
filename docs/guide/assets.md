# Static Asset Handling

## Importing Asset as URL

Importing a static asset will return the resolved public URL when it is served:

```js
import imgUrl from './img.png';
document.getElementById('hero-img').src = imgUrl;
```

For example, `imgUrl` will be `/img.png` during development, and become `/assets/img.2d8efhg.png` in the production build.

The behavior is similar to webpack's `file-loader`. The difference is that the import can be either using absolute public paths (based on project root during dev) or relative paths.

- `url()` references in CSS are handled the same way.

- If using the Vue plugin, asset references in Vue SFC templates are automatically converted into imports.

- Common image, media, and font filetypes are detected as assets automatically. You can extend the internal list using the

- Referenced assets are included as part of the build assets graph, will get hashed file names, and can be processed by plugins for optimization.

- Assets smaller in bytes than thewill be inlined as base64 data URLs.

### Explicit URL Imports

Assets that are not included in the internal list or in `assetsInclude`, can be explicitly imported as an URL using the `?url` suffix. This is useful, for example, to import [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url';
CSS.paintWorklet.addModule(workletURL);
```

### Importing Asset as String

Assets can be imported as strings using the `?raw` suffix.

```js
import shaderString from './shader.glsl?raw';
```

### Importing Script as a Worker

Scripts can be imported as web workers with the `?worker` or `?sharedworker` suffix.

```js
// Separate chunk in the production build
import Worker from './shader.js?worker';
const worker = new Worker();
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker';
const sharedWorker = new SharedWorker();
```

```js
// Inlined as base64 strings
import InlineWorker from './shader.js?worker&inline';
```

Check out the [Web Worker section](./features.md#web-workers) for more details.

## The `public` Directory

If you have assets that are:

- Never referenced in source code (e.g. `robots.txt`)
- Must retain the exact same file name (without hashing)
- ...or you simply don't want to have to import an asset first just to get its URL

Then you can place the asset in a special `public` directory under your project root. Assets in this directory will be served at root path `/` during dev, and copied to the root of the dist directory as-is.

The directory defaults to `<root>/public`, but can be configured via the

Note that:

- You should always reference `public` assets using root absolute path - for example, `public/icon.png` should be referenced in source code as `/icon.png`.
- Assets in `public` cannot be imported from JavaScript.

## new URL(url, import.meta.url)

[import.meta.url](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) is a native ESM feature that exposes the current module's URL. Combining it with the native [URL constructor](https://developer.mozilla.org/en-US/docs/Web/API/URL), we can obtain the full, resolved URL of a static asset using relative path from a JavaScript module:

```js
const imgUrl = new URL('./img.png', import.meta.url).href;

document.getElementById('hero-img').src = imgUrl;
```

This works natively in modern browsers - in fact, Vite doesn't need to process this code at all during development!

This pattern also supports dynamic URLs via template literals:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href;
}
```

During the production build, Vite will perform necessary transforms so that the URLs still point to the correct location even after bundling and asset hashing.

::: warning Note: Does not work with SSR
This pattern does not work if you are using Vite for Server-Side Rendering, because `import.meta.url` have different semantics in browsers vs. Node.js. The server bundle also cannot determine the client host URL ahead of time.
:::
