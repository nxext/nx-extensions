---
id: component
title: Component
---

Generates a Svelte library

## Usage

```
nx g @nxext/svelte:lib my-lib
```

or

```
nx g @nxext/svelte:library my-lib
```

## Options

### --directory

Alias(es): d

Type: `string`

A directory where the project is placed

### --unitTestRunner

Default: `jest`

Possible values: jest, none

Type: `enum`

Adds the specified unit test runner.

## --buildable

Default: false

Type: `boolean`

Generate the build command and be able to build and redistribute the library independently.

### --skipFormat

Default: `false`

Type: `boolean`
