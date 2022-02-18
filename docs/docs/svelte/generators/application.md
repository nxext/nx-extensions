---
title: '@nxext/svelte:application generator'
description: 'Svelte application schematic'
---

# @nxext/svelte:application

Svelte application schematic

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
nx g @nxext/svelte:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

## Options

### name (_**required**_)

Type: `string`

### directory

Alias(es): d

Type: `string`

A directory where the lib is placed.

### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (e2e) tests.

### host

Default: `localhost`

Type: `string`

Host to listen on.

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`

The tool to use for running lint checks.

### port

Default: `5000`

Type: `number`

Port to listen on.

### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `vitest`, `none`

Test runner to use for unit tests.
