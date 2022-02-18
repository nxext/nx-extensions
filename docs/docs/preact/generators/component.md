---
title: '@nxext/preact:component generator'
description: 'Add component'
---

# @nxext/preact:component

Add component

## Usage

```bash
nx generate component ...
```

```bash
nx g c ... # same
```

By default, Nx will search for `component` in the default collection provisioned in `workspace.json`.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/preact:component ...
```

Show what will be generated without writing to disk:

```bash
nx g component ... --dry-run
```

## Options

### name (_**required**_)

Type: `string`

### project (_**required**_)

Alias(es): p

Type: `string`

Project where the component is generated

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
