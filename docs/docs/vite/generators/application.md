---
title: '@nxext/vite:application generator'
description: 'Create a vite application'
---

# @nxext/vite:application

Create a vite application

## Usage

```bash
nx generate application ...
```

```bash
nx g app ... # same
```

By default, Nx will search for `application` in the default collection provisioned in `workspace.json`.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/vite:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Examples

Generate apps/myorg/myapp:

```bash
nx g app myapp --directory=myorg
```

## Options

### directory

Alias(es): dir

Type: `string`

The directory of the new application.

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`

The tool to use for running lint checks.

### name

Type: `string`

The name of the application.

### pascalCaseFiles

Alias(es): P

Default: `false`

Type: `boolean`

Use pascal case component file name (e.g. App.tsx).

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

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json

### supportJSX

Default: `true`

Type: `boolean`

Add support for JSX/TSX

### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
