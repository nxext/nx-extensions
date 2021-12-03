---
id: library
title: Library
---

# @nxext/react:lib

Generates a vite library

## Usage

```
nx g @nxext/vite:lib my-lib
```

or

```
nx g @nxext/vite:library my-lib
```

## Options

### name (_**required**_)

Type: `string`

Library name

### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

### directory

Alias(es): dir

Type: `string`

A directory where the lib is placed.

### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

### supportTsx

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files.

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint` - try and avoid tslint

The tool to use for running lint checks.

### pascalCaseFiles

Alias(es): P

Default: `false`

Type: `boolean`

Use pascal case component file name (e.g. App.tsx).

### publishable

Type: `boolean`

Create a publishable library.

### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`

### strict

Default: `true`

Type: `boolean`

Whether to enable tsconfig strict mode or not.

### tags

Alias(es): t

Type: `string`

Add tags to the library (used for linting).

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
