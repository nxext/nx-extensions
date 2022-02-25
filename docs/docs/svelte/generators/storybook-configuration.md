---
title: '📦 @nxext/svelte:storybook-configuration generator'
description: 'storybook-configuration generator'
sidebarDepth: 4
---

# @nxext/svelte:storybook-configuration

storybook-configuration generator

## Usage

```bash
nx generate storybook-configuration ...
```

By default, Nx will search for `storybook-configuration` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/svelte:storybook-configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g storybook-configuration ... --dry-run
```

## Options

### name (_**required**_)

Type: `string`

Library or application name

### configureCypress

Type: `boolean`

Run the cypress-configure generator

### cypressDirectory

Type: `string`

A directory where the Cypress project will be placed. Added at root by default.

### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files

### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`, `none`

The tool to use for running lint checks.

### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json
