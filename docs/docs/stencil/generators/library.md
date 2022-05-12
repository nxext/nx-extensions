## @nxext/stencil:library

Generate Stencil Library

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
nx g @nxext/stencil:library ...
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

#### component

Default: `true`

Type: `boolean`

Generate a default component.

#### directory

Alias(es): d

Type: `string`

A directory where the project is placed

#### e2eTestRunner

Default: `puppeteer`

Type: `string`

Possible values: `puppeteer`, `none`

Test runner to use for end to end (e2e) tests

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `tslint`

The tool to use for running lint checks.

#### publishable

Type: `boolean`

Create a publishable library.

#### skipFormat

Default: `false`

Type: `boolean`

#### style

Alias(es): s

Default: `css`

Type: `string`

Possible values: `css`, `scss`, `styl`, `less`, `pcss`

The file extension to be used for style files.

#### tags

Alias(es): t

Type: `string`

Add tags to the project (used for linting)

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
