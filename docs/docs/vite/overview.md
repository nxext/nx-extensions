# Introduction to Nxext Vite

[@nxext/vite](https://github.com/nxext/nx-extensions/tree/main/packages/vite) is a nx plugin to bring [Solid](https://solid.dev/) and [Svelte](https://svelte.dev/) to [Nx](https://nx.dev/).

We at Nxext believe the key to productivity is faster builds. [Nrwl NX](https://nx.dev) has done an amazing job with the enterprise-level monorepo. However, the crocks are still tied in [Angular](https://angular.io) and as a result [Webpack](https://webpack.js.org/). So we've turned to [Vite](https://vitejs.dev/) a build system that's bother quicker and smaller bundles.

::: danger
The @nxext/vite package will be deprecated soon in favor of the new œnrwl/vite package
:::

## Adding Vite builds

Adding the React plugin to a workspace can be done with the following:

```bash
#yarn
yarn add -D @nxext/vite
```

```bash
#npm
npm install -D @nxext/vite
```

## Proxying to a backend server

Use the [proxying support](https://vitejs.dev/config/#server-proxy) in the `Vite createServer` development server to divert certain URLs to a backend server, by passing a file to the `--proxy-config` build option.
For example, to divert all calls for `http://localhost:4200/api` to a server running on `http://localhost:3000/api`, take the following steps.

1. Create a file `proxy.conf.json` in your project's `<project>/src/` folder.

1. Add the following content to the new proxy file:

   ```
   {
     "/api": {
       "target": "http://jsonplaceholder.typicode.com"
     }
   }
   ```

1. In the CLI configuration file, `<project>/project.json` or `<root>/workspace.json`, add the `proxyConfig` option to the `serve` target:

   ```
   ...
   "targets": {
     "serve": {
       "executor": "@nxext/vite:build",
       ...
       "options": {
         "outputPath": "dist/apps/t",
         "proxyConfig": "apps/my-react/src/proxy.conf.json",
         ....
       },
   ...
   ```

1. To run the development server with this proxy configuration, call `nx serve`.

Edit the proxy configuration file to add configuration options; following are some examples.
For a description of all options, see [Vite CreateServer documentation](https://vitejs.dev/config/#server-proxy).

Note that if you edit the proxy configuration file, you must relaunch the `nx serve` process to make your changes effective.

If you need to access a backend that is not on `localhost`, set the `changeOrigin` option as well. For example:

```
{
  "/api": {
    "target": "http://npmjs.org",
    "changeOrigin": true
  }
}
```

### Rewrite the URL path

> Set the proxy configuration file to `proxy.conf.js` (instead of `proxy.conf.json`), and specify configuration files as in the following example.

The `rewrite` proxy configuration option lets you rewrite the URL path at run time.
For example, specify the following `rewrite` value to the proxy configuration to remove "api" from the end of a path.

```
export default {
  '/api': {
    target: 'http://jsonplaceholder.typicode.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  },
}
```
