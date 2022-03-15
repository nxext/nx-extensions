# Plugin API

Vite plugins extends Rollup's well-designed plugin interface with a few extra Vite-specific options. As a result, you can write a Vite plugin once and have it work for both dev and build.

**It is recommended to go through [Rollup's plugin documentation](https://rollupjs.org/guide/en/#plugin-development) first before reading the sections below.**

## Authoring a Plugin

Vite strives to offer established patterns out of the box, so before creating a new plugin make sure that you check the [Features guide](https://vitejs.dev/guide/features) to see if your need is covered. Also review available community plugins, both in the form of a [compatible Rollup plugin](https://github.com/rollup/awesome) and [Vite Specific plugins](https://github.com/vitejs/awesome-vite#plugins)

When creating a plugin, you can inline it in your `vite.config.js`. There is no need to create a new package for it. Once you see that a plugin was useful in your projects, consider sharing it to help others [in the ecosystem](https://chat.vitejs.dev).

::: tip
When learning, debugging, or authoring plugins we suggest including [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) in your project. It allows you to inspect the intermediate state of Vite plugins. After installing, you can visit `localhost:3000/__inspect/` to inspect the modules and transformation stack of your project. Check out install instructions in the [vite-plugin-inspect docs](https://github.com/antfu/vite-plugin-inspect).
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## Conventions

If the plugin doesn't use Vite specific hooks and can be implemented as a [Compatible Rollup Plugin](#rollup-plugin-compatibility), then it is recommended to use the [Rollup Plugin naming conventions](https://rollupjs.org/guide/en/#conventions).

- Rollup Plugins should have a clear name with `rollup-plugin-` prefix.
- Include `rollup-plugin` and `vite-plugin` keywords in package.json.

This exposes the plugin to be also used in pure Rollup or WMR based projects

For Vite only plugins

- Vite Plugins should have a clear name with `vite-plugin-` prefix.
- Include `vite-plugin` keyword in package.json.
- Include a section in the plugin docs detailing why it is a Vite only plugin (for example, it uses Vite specific plugin hooks).

If your plugin is only going to work for a particular framework, its name should be included as part of the prefix

- `vite-plugin-vue-` prefix for Vue Plugins
- `vite-plugin-react-` prefix for React Plugins
- `vite-plugin-svelte-` prefix for Svelte Plugins

See also [Virtual Modules Convention](#virtual-modules-convention).

## Plugins config

Users will add plugins to the project `devDependencies` and configure them using the `plugins` array option.

```js
// vite.config.js
import vitePlugin from 'vite-plugin-feature';
import rollupPlugin from 'rollup-plugin-feature';

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()],
});
```

Falsy plugins will be ignored, which can be used to easily activate or deactivate plugins.

`plugins` also accept presets including several plugins as a single element. This is useful for complex features (like framework integration) that are implemented using several plugins. The array will be flattened internally.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh';
import frameworkDevtools from 'vite-plugin-framework-devtools';

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)];
}
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import framework from 'vite-plugin-framework';

export default defineConfig({
  plugins: [framework()],
});
```

## Simple Examples

:::tip
It is common convention to author a Vite/Rollup plugin as a factory function that returns the actual plugin object. The function can accept options which allows users to customize the behavior of the plugin.
:::

### Transforming Custom File Types

```js
const fileRegex = /\.(my-file-ext)$/;

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null, // provide source map if available
        };
      }
    },
  };
}
```

### Importing a Virtual File

See the example in the [next section](#virtual-modules-convention).

## Virtual Modules Convention

Virtual modules are a useful scheme that allows you to pass build time information to the source files using normal ESM import syntax.

```js
export default function myPlugin() {
  const virtualModuleId = '@my-virtual-module';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'my-plugin', // required, will show up in warnings and errors
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`;
      }
    },
  };
}
```

Which allows importing the module in JavaScript:

```js
import { msg } from '@my-virtual-module';

console.log(msg);
```

Virtual modules in Vite (and Rollup) are prefixed with `virtual:` for the user-facing path by convention. If possible the plugin name should be used as a namespace to avoid collisions with other plugins in the ecosystem. For example, a `vite-plugin-posts` could ask users to import a `virtual:posts` or `virtual:posts/helpers` virtual modules to get build time information. Internally, plugins that use virtual modules should prefix the module ID with `\0` while resolving the id, a convention from the rollup ecosystem. This prevents other plugins from trying to process the id (like node resolution), and core features like sourcemaps can use this info to differentiate between virtual modules and regular files. `\0` is not a permitted char in import URLs so we have to replace them during import analysis. A `\0{id}` virtual id ends up encoded as `/@id/__x00__{id}` during dev in the browser. The id will be decoded back before entering the plugins pipeline, so this is not seen by plugins hooks code.

Note that modules directly derived from a real file, as in the case of a script module in a Single File Component (like a .vue or .svelte SFC) don't need to follow this convention. SFCs generally generate a set of submodules when processed but the code in these can be mapped back to the filesystem. Using `\0` for these submodules would prevent sourcemaps from working correctly.

## Universal Hooks

During dev, the Vite dev server creates a plugin container that invokes [Rollup Build Hooks](https://rollupjs.org/guide/en/#build-hooks) the same way Rollup does it.

The following hooks are called once on server start:

- [`options`](https://rollupjs.org/guide/en/#options)
- [`buildStart`](https://rollupjs.org/guide/en/#buildstart)

The following hooks are called on each incoming module request:

- [`resolveId`](https://rollupjs.org/guide/en/#resolveid)
- [`load`](https://rollupjs.org/guide/en/#load)
- [`transform`](https://rollupjs.org/guide/en/#transform)

The following hooks are called when the server is closed:

- [`buildEnd`](https://rollupjs.org/guide/en/#buildend)
- [`closeBundle`](https://rollupjs.org/guide/en/#closebundle)

Note that the [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) hook is **not** called during dev, because Vite avoids full AST parses for better performance.

[Output Generation Hooks](https://rollupjs.org/guide/en/#output-generation-hooks) (except `closeBundle`) are **not** called during dev. You can think of Vite's dev server as only calling `rollup.rollup()` without calling `bundle.generate()`.

## Vite Specific Hooks

Vite plugins can also provide hooks that serve Vite-specific purposes. These hooks are ignored by Rollup.

### `config`

- **Type:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Kind:** `async`, `sequential`

  Modify Vite config before it's resolved. The hook receives the raw user config (CLI options merged with config file) and the current config env which exposes the `mode` and `command` being used. It can return a partial config object that will be deeply merged into existing config, or directly mutate the config (if the default merging cannot achieve the desired result).

  **Example:**

  ```js
  // return partial config (recommended)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      alias: {
        foo: 'bar',
      },
    }),
  });

  // mutate the config directly (use only when merging doesn't work)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = __dirname;
      }
    },
  });
  ```

  ::: warning Note
  User plugins are resolved before running this hook so injecting other plugins inside the `config` hook will have no effect.
  :::

### `configResolved`

- **Type:** `(config: ResolvedConfig) => void | Promise<void>`
- **Kind:** `async`, `parallel`

  Called after the Vite config is resolved. Use this hook to read and store the final resolved config. It is also useful when the plugin needs to do something different based the command is being run.

  **Example:**

  ```js
  const examplePlugin = () => {
    let config;

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // store the resolved config
        config = resolvedConfig;
      },

      // use stored config in other hooks
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: plugin invoked by dev server
        } else {
          // build: plugin invoked by Rollup
        }
      },
    };
  };
  ```

  Note that the `command` value is `serve` in dev (in the cli `vite`, `vite dev`, and `vite serve` are aliases).

### `configureServer`

- **Type:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Kind:** `async`, `sequential`
- **See also:** [ViteDevServer](./api-javascript#vitedevserver)

  Hook for configuring the dev server. The most common use case is adding custom middlewares to the internal [connect](https://github.com/senchalabs/connect) app:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // custom handle request...
      });
    },
  });
  ```

  **Injecting Post Middleware**

  The `configureServer` hook is called before internal middlewares are installed, so the custom middlewares will run before internal middlewares by default. If you want to inject a middleware **after** internal middlewares, you can return a function from `configureServer`, which will be called after internal middlewares are installed:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      // return a post hook that is called after internal middlewares are
      // installed
      return () => {
        server.middlewares.use((req, res, next) => {
          // custom handle request...
        });
      };
    },
  });
  ```

  **Storing Server Access**

  In some cases, other plugin hooks may need access to the dev server instance (e.g. accessing the web socket server, the file system watcher, or the module graph). This hook can also be used to store the server instance for access in other hooks:

  ```js
  const myPlugin = () => {
    let server;
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server;
      },
      transform(code, id) {
        if (server) {
          // use server...
        }
      },
    };
  };
  ```

  Note `configureServer` is not called when running the production build so your other hooks need to guard against its absence.

### `transformIndexHtml`

- **Type:** `IndexHtmlTransformHook | { enforce?: 'pre' | 'post', transform: IndexHtmlTransformHook }`
- **Kind:** `async`, `sequential`

  Dedicated hook for transforming `index.html`. The hook receives the current HTML string and a transform context. The context exposes the [`ViteDevServer`](./api-javascript#vitedevserver) instance during dev, and exposes the Rollup output bundle during build.

  The hook can be async and can return one of the following:

  - Transformed HTML string
  - An array of tag descriptor objects (`{ tag, attrs, children }`) to inject to the existing HTML. Each tag can also specify where it should be injected to (default is prepending to `<head>`)
  - An object containing both as `{ html, tags }`

  **Basic Example:**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        );
      },
    };
  };
  ```

  **Full Hook Signature:**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string;
      filename: string;
      server?: ViteDevServer;
      bundle?: import('rollup').OutputBundle;
      chunk?: import('rollup').OutputChunk;
    }
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>;

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string;
        tags: HtmlTagDescriptor[];
      };

  interface HtmlTagDescriptor {
    tag: string;
    attrs?: Record<string, string | boolean>;
    children?: string | HtmlTagDescriptor[];
    /**
     * default: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend';
  }
  ```

### `handleHotUpdate`

- **Type:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  Perform custom HMR update handling. The hook receives a context object with the following signature:

  ```ts
  interface HmrContext {
    file: string;
    timestamp: number;
    modules: Array<ModuleNode>;
    read: () => string | Promise<string>;
    server: ViteDevServer;
  }
  ```

  - `modules` is an array of modules that are affected by the changed file. It's an array because a single file may map to multiple served modules (e.g. Vue SFCs).

  - `read` is an async read function that returns the content of the file. This is provided because on some systems, the file change callback may fire too fast before the editor finishes updating the file and direct `fs.readFile` will return empty content. The read function passed in normalizes this behavior.

  The hook can choose to:

  - Filter and narrow down the affected module list so that the HMR is more accurate.

  - Return an empty array and perform complete custom HMR handling by sending custom events to the client:

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

    Client code should register corresponding handler using the [HMR API](./api-hmr) (this could be injected by the same plugin's `transform` hook):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // perform custom update
      });
    }
    ```

## Plugin Ordering

A Vite plugin can additionally specify an `enforce` property (similar to webpack loaders) to adjust its application order. The value of `enforce` can be either `"pre"` or `"post"`. The resolved plugins will be in the following order:

- Alias
- User plugins with `enforce: 'pre'`
- Vite core plugins
- User plugins without enforce value
- Vite build plugins
- User plugins with `enforce: 'post'`
- Vite post build plugins (minify, manifest, reporting)

## Conditional Application

By default plugins are invoked for both serve and build. In cases where a plugin needs to be conditionally applied only during serve or build, use the `apply` property to only invoke them during `'build'` or `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build', // or 'serve'
  };
}
```

A function can also be used for more precise control:

```js
apply(config, { command }) {
  // apply only on build but not for SSR
  return command === 'build' && !config.build.ssr
}
```

## Rollup Plugin Compatibility

A fair number of Rollup plugins will work directly as a Vite plugin (e.g. `@rollup/plugin-alias` or `@rollup/plugin-json`), but not all of them, since some plugin hooks do not make sense in an unbundled dev server context.

In general, as long as a Rollup plugin fits the following criteria then it should just work as a Vite plugin:

- It doesn't use the [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) hook.
- It doesn't have strong coupling between bundle-phase hooks and output-phase hooks.

If a Rollup plugin only makes sense for the build phase, then it can be specified under `build.rollupOptions.plugins` instead.

You can also augment an existing Rollup plugin with Vite-only properties:

```js
// vite.config.js
import example from 'rollup-plugin-example';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build',
    },
  ],
});
```

Check out [Vite Rollup Plugins](https://vite-rollup-plugins.patak.dev) for a list of compatible official Rollup plugins with usage instructions.

## Path normalization

Vite normalizes paths while resolving ids to use POSIX separators ( / ) while preserving the volume in Windows. On the other hand, Rollup keeps resolved paths untouched by default, so resolved ids have win32 separators ( \\ ) in Windows. However, Rollup plugins use a [`normalizePath` utility function](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) from `@rollup/pluginutils` internally, which converts separators to POSIX before performing comparisons. This means that when these plugins are used in Vite, the `include` and `exclude` config pattern and other similar paths against resolved ids comparisons work correctly.

So, for Vite plugins, when comparing paths against resolved ids it is important to first normalize the paths to use POSIX separators. An equivalent `normalizePath` utility function is exported from the `vite` module.

```js
import { normalizePath } from 'vite';

normalizePath('foo\\bar'); // 'foo/bar'
normalizePath('foo/bar'); // 'foo/bar'
```
