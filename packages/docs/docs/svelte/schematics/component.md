---
id: component
title: Component
---

Generates a Svelte component

## Usage

```
nx g @nxext/svelte:c my-app
```

or

```
nx g @nxext/svelte:component my-app
```

## Options

### --project

Alias(es): p

Type: `string`

Project where the component is generated

### --directory

Alias(es): d

Type: `string`

A directory where the project is placed

### --unitTestRunner

Default: `jest`

Possible values: jest, none

Type: `enum`

Adds the specified unit test runner.

### --skipFormat

Default: `false`

Type: `boolean`
