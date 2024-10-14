## @nxext/solid:application

Solid application schematic

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
nx g @nxext/solid:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### directory (_**required**_)

Alias(es): d

Type: `string`

A directory where the project is placed.

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (e2e) tests.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### name

Alias(es): n

Type: `string`

A name of the project.

#### rootProject (**hidden**)

Default: `false`

Type: `boolean`

Create a application at the root of the workspace

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

Possible values: `vitest`, `jest`, `none`

Test runner to use for unit tests.

## @nxext/solid:library

Solid library schematic

### Usage

```bash
nx generate library ...
```

```bash
nx g lib ... # same
```

By default, Nx will search for `library` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/solid:library ...
```

Show what will be generated without writing to disk:

```bash
nx g library ... --dry-run
```

### Options

#### directory (_**required**_)

Alias(es): d

Type: `string`

A directory where the project is placed.

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

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

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### name

Alias(es): n

Type: `string`

A name of the project.

#### publishable

Type: `boolean`

Create a publishable library.

#### simpleName

Default: `false`

Type: `boolean`

Don't include the directory in the name of the module of the library.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.

## @nxext/solid:component

Add component

### Usage

```bash
nx generate component ...
```

```bash
nx g c ... # same
```

By default, Nx will search for `component` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/solid:component ...
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

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
