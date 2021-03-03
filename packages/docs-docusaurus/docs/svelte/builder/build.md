---
id: build
title: Build
---

## Usage

```
nx build my-app
```

## Options

### --outputPath

Type: `string`

The output path of the generated files.

### --tsConfig

Type: `string`

The name of the Typescript configuration file.

### --entryFile

Type: `string`

The name of the main entry-point file.

### --rollupConfig

Default: `null`

Type: `string`

Path to a function which takes a rollup config and SvelteBuildOptions object and returns an updated rollup config

### --svelteConfig

Default: `null`

Type: `string`

Path to a svelte.config.js file, which exports a svelte config for the svelte-rollup-plugin.


### --sveltePreprocessConfig

Default: `null`

Path to a function which takes SvelteBuildOptions object and returns an new sveltePreprocessor options object.

### --assets

Default: `[]`

Type: `array`

List of static application assets.

### --watch

Default: `false`

Type: `boolean`

Start watchmode

### --serve

Default: `false`

Type: `boolean`

Serve on dev webserver

### --prod

Default: `false`

Type: `boolean`

Is prod build

### --open

Default: `false`

Type: `boolean`

Open in browser

### --port

Default: `4200`

Type: `number`

Port to listen on.

### --host

Default: `localhost`

Type: `string`

Host to listen on.
