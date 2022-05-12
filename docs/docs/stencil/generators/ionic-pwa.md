## @nxext/stencil:ionic-pwa

Generate Stencil ionic pwa

### Usage

```bash
nx generate ionic-pwa ...
```

```bash
nx g pwa ... # same
```

By default, Nx will search for `ionic-pwa` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/stencil:ionic-pwa ...
```

Show what will be generated without writing to disk:

```bash
nx g ionic-pwa ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### directory

Alias(es): d

Type: `string`

A directory where the project is placed

#### e2eTestRunner

Default: `puppeteer`

Type: `string`

Possible values: `puppeteer`, `none`

Test runner to use for end to end (e2e) tests

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

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
