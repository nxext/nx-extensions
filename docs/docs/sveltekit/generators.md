## @nxext/sveltekit:application

sveltekit app generator

### Usage

```bash
nx generate application ...
```

```bash
nx g app ... # same
```

By default, Nx will search for `application` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/sveltekit:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### directory

Alias(es): d

Type: `string`

A directory where the project is placed

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

## @nxext/sveltekit:component

component generator

### Usage

```bash
nx generate component ...
```

By default, Nx will search for `component` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/sveltekit:component ...
```

Show what will be generated without writing to disk:

```bash
nx g component ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### project (_**required**_)

Alias(es): p

Type: `string`

Project where the component is generated

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.
