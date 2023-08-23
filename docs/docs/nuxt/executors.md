## @nxext/nuxt:build

Nuxt build

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### debug

Default: `false`

Type: `boolean`

At the moment, it prints out hook names and timings on the server, and logs hook arguments as well in the browser.

#### dev

Default: `false`

Type: `boolean`

Whether Nuxt is running in development mode.

#### outputPath

Type: `string`

The output path of the generated files.

#### ssr

Type: `boolean`

Whether to enable rendering of HTML - either dynamically (in server mode) or at generate time. If set to false generated pages will have no content.

## @nxext/nuxt:serve

Nuxt dev server

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### debug

Default: `false`

Type: `boolean`

At the moment, it prints out hook names and timings on the server, and logs hook arguments as well in the browser.

#### dev

Default: `true`

Type: `boolean`

Whether Nuxt is running in development mode.

#### host

Type: `string`

Dev server listening host.

#### port

Default: `3000`

Type: `number`

Dev server listening port

#### ssr

Default: `true`

Type: `boolean`

Whether to enable rendering of HTML - either dynamically (in server mode) or at generate time. If set to false generated pages will have no content.
