---
title: '@nxext/vite:package executor'
description: 'Build package'
---

# @nxext/vite:package

Build package

Options can be configured in `workspace.json` when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

## Options

### entryFile (_**required**_)

Type: `string`

The name of the main entry-point file.

### outputPath (_**required**_)

Type: `string`

The output path of the generated files.

### assets

Type: `array`

List of static assets.

### configFile

Type: `string`

Path to the vite config

### external

Type: `array`

external libs

### frameworkConfigFile (**hidden**)

Type: `string`

The path to vite.config.js for the framework.

### packageJson

Type: `string`

The name of the package.json file
