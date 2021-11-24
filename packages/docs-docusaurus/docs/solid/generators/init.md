---
id: init
title: Init
---

This schematic installs the following deendencies:

```
solid-jest
solid
```

## Usage

```
nx g @nxext/solid:init
```

## Options

### --unitTestRunner

Default: `jest`

Possible values: jest, none

Type: `enum`

Adds the specified unit test runner.

### --e2eTestRunner

Default: `cypress`

Possible values: cypress, none

Type: `enum`

Adds the specified e2e test runner.

### --skipFormat

Default: `false`

Type: `boolean`
