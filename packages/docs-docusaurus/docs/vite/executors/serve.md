---
id: serve
title: Serve
---

# @nxext/vite:dev

Run your vite application in a development server

## Usage

```
nx serve my-app
```

### --configFile

Type: `string`

The path to vite.config.js file.

### --baseHref

Type: `string`

Base url for the application being built.

### --frameworkConfigFile

Type: `string`

This is the framework vite.config.js file. This property is hidden from the schema requirements, but should be use when building an extention ontop of `@nxext/vite`. For reference checkout our react plugin

### --fileReplacements

Type: `object[]`

Replace files with other files in the build.

replace
Type: `string`

The file to be replaced.

with
Type: `string`

The file to replace with.

### --proxyConfig

Type: `string`

The path to proxy.conf.json file.

#### Examples

```json
{
  "/foo": "http://localhost:4567",
  "/api": {
    "target": "http://jsonplaceholder.typicode.com",
    "changeOrigin": true
  }
}
```
