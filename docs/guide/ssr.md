# Server-Side Rendering

:::warning Experimental
SSR support is still experimental and you may encounter bugs and unsupported use cases. Proceed at your own risk.
:::

:::tip Note
SSR specifically refers to front-end frameworks (for example React, Preact, Vue, and Svelte) that support running the same application in Node.js, pre-rendering it to HTML, and finally hydrating it on the client. If you are looking for integration with traditional server-side frameworks, check out the [Backend Integration guide](./backend-integration) instead.

The following guide also assumes prior experience working with SSR in your framework of choice, and will only focus on Vite-specific integration details.
:::

:::warning Low-level API
This is a low-level API meant for library and framework authors. If your goal is to create an application, make sure to check out the higher-level SSR plugins and tools at [Awesome Vite SSR section](https://github.com/vitejs/awesome-vite#ssr) first. That said, many applications are successfully built directly on top of Vite's native low-level API.
:::

:::tip Help
If you have questions, the community is usually helpful at [Vite Discord's #ssr channel](https://discord.gg/PkbxgzPhJv).
:::

## Example Projects

Vite provides built-in support for server-side rendering (SSR). The Vite playground contains example SSR setups for Vue 3 and React, which can be used as references for this guide:

- [Vue 3](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)
- [React](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-react)

## Source Structure

A typical SSR application will have the following source file structure:

```
- index.html
- server.js # main application server
- src/
  - main.js          # exports env-agnostic (universal) app code
  - entry-client.js  # mounts the app to a DOM element
  - entry-server.js  # renders the app using the framework's SSR API
```

The `index.html` will need to reference `entry-client.js` and include a placeholder where the server-rendered markup should be injected:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

You can use any placeholder you prefer instead of `<!--ssr-outlet-->`, as long as it can be precisely replaced.

## Conditional Logic

If you need to perform conditional logic based on SSR vs. client, you can use

```js
if (import.meta.env.SSR) {
  // ... server only logic
}
```

This is statically replaced during build so it will allow tree-shaking of unused branches.

## Setting Up the Dev Server

When building an SSR app, you likely want to have full control over your main server and decouple Vite from the production environment. It is therefore recommended to use Vite in middleware mode. Here is an example with [express](https://expressjs.com/):

**server.js**

```js{17-19}
const fs = require('fs')
const path = require('path')
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode. This disables Vite's own HTML
  // serving logic and let the parent server take control.
  //
  // In middleware mode, if you want to use Vite's own HTML serving logic
  // use `'html'` as the `middlewareMode` (ref https://vitejs.dev/config/#server-middlewaremode)
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // serve index.html - we will tackle this next
  })

  app.listen(3000)
}

createServer()
```

Here `vite` is an instance of [ViteDevServer](./api-javascript#vitedevserver). `vite.middlewares` is a [Connect](https://github.com/senchalabs/connect) instance which can be used as a middleware in any connect-compatible Node.js framework.

The next step is implementing the `*` handler to serve server-rendered HTML:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl;

  try {
    // 1. Read index.html
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    );

    // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
    //    also applies HTML transforms from Vite plugins, e.g. global preambles
    //    from @vitejs/plugin-react
    template = await vite.transformIndexHtml(url, template);

    // 3. Load the server entry. vite.ssrLoadModule automatically transforms
    //    your ESM source code to be usable in Node.js! There is no bundling
    //    required, and provides efficient invalidation similar to HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js');

    // 4. render the app HTML. This assumes entry-server.js's exported `render`
    //    function calls appropriate framework SSR APIs,
    //    e.g. ReactDOMServer.renderToString()
    const appHtml = await render(url);

    // 5. Inject the app-rendered HTML into the template.
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);

    // 6. Send the rendered HTML back.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (e) {
    // If an error is caught, let Vite fix the stracktrace so it maps back to
    // your actual source code.
    vite.ssrFixStacktrace(e);
    next(e);
  }
});
```

The `dev` script in `package.json` should also be changed to use the server script instead:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Building for Production

To ship an SSR project for production, we need to:

1. Produce a client build as normal;
2. Produce an SSR build, which can be directly loaded via `require()` so that we don't have to go through Vite's `ssrLoadModule`;

Our scripts in `package.json` will look like this:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js "
  }
}
```

Note the `--ssr` flag which indicates this is an SSR build. It should also specify the SSR entry.

Then, in `server.js` we need to add some production specific logic by checking `process.env.NODE_ENV`:

- Instead of reading the root `index.html`, use the `dist/client/index.html` as the template instead, since it contains the correct asset links to the client build.

- Instead of `await vite.ssrLoadModule('/src/entry-server.js')`, use `require('./dist/server/entry-server.js')` instead (this file is the result of the SSR build).

- Move the creation and all usage of the `vite` dev server behind dev-only conditional branches, then add static file serving middlewares to serve files from `dist/client`.

Refer to the [Vue](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue) and [React](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-react) demos for working setup.

## Generating Preload Directives

`vite build` supports the `--ssrManifest` flag which will generate `ssr-manifest.json` in build output directory:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

The above script will now generate `dist/client/ssr-manifest.json` for the client build (Yes, the SSR manifest is generated from the client build because we want to map module IDs to client files). The manifest contains mappings of module IDs to their associated chunks and asset files.

To leverage the manifest, frameworks need to provide a way to collect the module IDs of the components that were used during a server render call.

`@vitejs/plugin-vue` supports this out of the box and automatically registers used component module IDs on to the associated Vue SSR context:

```js
// src/entry-server.js
const ctx = {};
const html = await vueServerRenderer.renderToString(app, ctx);
// ctx.modules is now a Set of module IDs that were used during the render
```

In the production branch of `server.js` we need to read and pass the manifest to the `render` function exported by `src/entry-server.js`. This would provide us with enough information to render preload directives for files used by async routes! See [demo source](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/src/entry-server.js) for full example.

## Pre-Rendering / SSG

If the routes and the data needed for certain routes are known ahead of time, we can pre-render these routes into static HTML using the same logic as production SSR. This can also be considered a form of Static-Site Generation (SSG). See [demo pre-render script](https://github.com/vitejs/vite/blob/main/packages/playground/ssr-vue/prerender.js) for working example.

## SSR Externals

Many dependencies ship both ESM and CommonJS files. When running SSR, a dependency that provides CommonJS builds can be "externalized" from Vite's SSR transform / module system to speed up both dev and build. For example, instead of pulling in the pre-bundled ESM version of React and then transforming it back to be Node.js-compatible, it is more efficient to simply `require('react')` instead. It also greatly improves the speed of the SSR bundle build.

Vite performs automated SSR externalization based on the following heuristics:

- If a dependency's resolved ESM entry point and its default Node entry point are different, its default Node entry is probably a CommonJS build that can be externalized. For example, `vue` will be automatically externalized because it ships both ESM and CommonJS builds.

- Otherwise, Vite will check whether the package's entry point contains valid ESM syntax - if not, the package is likely CommonJS and will be externalized. As an example, `react-dom` will be automatically externalized because it only specifies a single entry which is in CommonJS format.

If this heuristics leads to errors, you can manually adjust SSR externals using `ssr.external` and `ssr.noExternal` config options.

In the future, this heuristics will likely improve to detect if the project has `type: "module"` enabled, so that Vite can also externalize dependencies that ship Node-compatible ESM builds by importing them via dynamic `import()` during SSR.

:::warning Working with Aliases
If you have configured aliases that redirects one package to another, you may want to alias the actual `node_modules` packages instead to make it work for SSR externalized dependencies. Both [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) and [pnpm](https://pnpm.js.org/en/aliases) support aliasing via the `npm:` prefix.
:::

## SSR-specific Plugin Logic

Some frameworks such as Vue or Svelte compiles components into different formats based on client vs. SSR. To support conditional transforms, Vite passes an additional `ssr` property in the `options` object of the following plugin hooks:

- `resolveId`
- `load`
- `transform`

**Example:**

```js
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // perform ssr-specific transform...
      }
    },
  };
}
```

The options object in `load` and `transform` is optional, rollup is not currently using this object but may extend these hooks with additional metadata in the future.

:::tip Note
Before Vite 2.7, this was informed to plugin hooks with a positional `ssr` param instead of using the `options` object. All major frameworks and plugins are updated but you may find outdated posts using the previous API.
:::

## SSR Target

The default target for the SSR build is a node environment, but you can also run the server in a Web Worker. Packages entry resolution is different for each platform. You can configure the target to be Web Worker using the `ssr.target` set to `'webworker'`.

## SSR Bundle

In some cases like `webworker` runtimes, you might want to bundle your SSR build into a single JavaScript file. You can enable this behavior by setting `ssr.noExternal` to `true`. This will do two things:

- Treat all dependencies as `noExternal`
- Throw an error if any Node.js built-ins are imported
