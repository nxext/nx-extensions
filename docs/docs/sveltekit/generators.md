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

#### adapterVersion

Type: `string`

The version to use for sveltekit adapter-auto

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

#### skipPackageJson

Default: `false`

Type: `boolean`

Do not add dependencies to `package.json`.

#### svelteKitVersion

Type: `string`

The sveltekit version to use

#### svelteVersion

Type: `string`

The svelte version to use

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

## @nxext/sveltekit:library

route generator

### Usage

```bash
nx generate library ...
```

By default, Nx will search for `library` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/sveltekit:library ...
```

Show what will be generated without writing to disk:

```bash
nx g library ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

#### directory

Alias(es): d

Type: `string`

A directory where the lib is placed.

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (e2e) tests.

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`

The tool to use for running lint checks.

#### publishable

Type: `boolean`

Create a publishable library.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `jest`, `vitest`, `none`

Test runner to use for unit tests.

## @nxext/sveltekit:route

route generator

### Usage

```bash
nx generate route ...
```

By default, Nx will search for `route` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/sveltekit:route ...
```

Show what will be generated without writing to disk:

```bash
nx g route ... --dry-run
```

### Options

#### name (_**required**_)

Alias(es): n

Type: `string`

#### project (_**required**_)

Type: `string`

Project where the component is generated

#### api

Alias(es): a

Default: `false`

Type: `boolean`

Whether to create a server API file

#### error

Alias(es): e

Default: `false`

Type: `boolean`

Whether to create an error page

#### layout

Alias(es): l

Default: `false`

Type: `boolean`

Whether to create a layout file

#### layoutClientLoader

Default: `false`

Type: `boolean`

Whether to create a layout client data loader file

#### layoutServerLoader

Default: `false`

Type: `boolean`

Whether to create a layout server data loader file

#### methods

Alias(es): m

Type: `string`

HTTP methods for endpoints (GET, POST)

#### page

Alias(es): p

Default: `true`

Type: `boolean`

Whether to create a page file

#### pageClientLoader

Alias(es): c

Default: `false`

Type: `boolean`

Whether to create a client data loader file

#### pageServerLoader

Alias(es): s

Default: `false`

Type: `boolean`

Whether to create a server data loader file

#### targetPath

Alias(es): t

Type: `string`

Where in the project the page should be generated

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.
