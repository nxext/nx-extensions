---
id: application
title: Application
---

# @nxext/vite:app

Generates a vite application

This schematic also executes the [Init](init) schematic

## Usage

```
nx g @nxext/vite:app my-lib
```

or

```
nx g @nxext/vite:application my-lib
```

## Options

### --name (_**required**_)

Type: `string`

The name of the application.

### --directory

Alias(es): dir

Type: `string`

The directory of the new application.

### --linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`

The tool to use for running lint checks.

### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

### skipWorkspaceJson

Default: `false`

Type: `boolean`

Skip updating workspace.json with default options based on values provided to this app (e.g. babel, style).

### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`

### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
