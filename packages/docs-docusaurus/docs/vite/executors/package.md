---
id: package
title: package
---

# @nxext/vite:package

Bundle your Vite library

## Usage

```
nx build my-lib
```

### --entryFile

Type: `string`

The path to the entry file, relative to project.

### --outputPath (_**required**_)

Type: `string`

The output path of the generated files

### --configFile

Type: `string`

The path to vite.config.js file.

### --packageJson

Type: `string`

path to package.json file

Usage: this is when your library is set to build and publish

### --globals:

Type: `Record<string, string>`

Provide global variables to use in the UMD build for externalized deps

### --external

Type: `string[]`

make sure to externalize deps that shouldn't be bundled into your library

### --frameworkConfigFile

Type: `string`

This is the framework vite.config.js file. This property is hidden from the schema requirements, but should be use when building an extention ontop of `@nxext/vite`. For reference checkout our react plugin

### --assets

Type: `array`

List of static assets.
