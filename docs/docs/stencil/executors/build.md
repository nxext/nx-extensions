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

### --prerender

Default: `false`

Type: `boolean`

Stencil doesn't prerender components by default. However, the build can be made to prerender using the --prerender flag

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

### --tsConfig

Type: `string`

The path to tsconfig file.
