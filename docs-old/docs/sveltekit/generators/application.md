---
title: '@nxext/sveltekit:application generator'
description: 'sveltekit app generator'
---

# @nxext/sveltekit:application

sveltekit app generator

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
nx g @nxext/sveltekit:application ...
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

A directory where the project is placed

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

### port

Default: `3000`

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
