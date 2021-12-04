---
id: build
title: Build
---

# @nxext/vite:build

Build an application using vite

Options can be configured in workspace.json when defining the executor, or when invoking it.

## Usage

```
nx build my-app
```

## Options

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
