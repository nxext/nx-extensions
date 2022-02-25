---
title: '📦 @nxext/stencil:add-outputtarget generator'
description: 'Add react/angular libraries for the component library'
sidebarDepth: 4
---

# @nxext/stencil:add-outputtarget

Add react/angular libraries for the component library

## Usage

```bash
nx generate add-outputtarget ...
```

By default, Nx will search for `add-outputtarget` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/stencil:add-outputtarget ...
```

Show what will be generated without writing to disk:

```bash
nx g add-outputtarget ... --dry-run
```

## Options

### outputType (_**required**_)

Type: `string`

Possible values: `angular`, `react`, `svelte`

Select what kind of library you want to generate.

### projectName (_**required**_)

Type: `string`

Project for that the library should be generated.

### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

### publishable

Default: `false`

Type: `boolean`

### skipFormat

Default: `false`

Type: `boolean`

### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Adds the specified unit test runner.
