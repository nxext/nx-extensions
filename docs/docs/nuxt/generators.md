## @nxext/nuxt:application

Create a Nuxt application.

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
nx g @nxext/nuxt:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### directory

Type: `string`

A directory where the project is placed

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `playwright`, `none`

Test runner to use for end to end (E2E) tests.

#### inSourceTests

Default: `false`

Type: `boolean`

When using Vitest, separate spec files will not be generated and instead will be included within the source files. Read more on the Vitest docs site: https://vitest.dev/guide/in-source.html

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### rootProject (**hidden**)

Default: `false`

Type: `boolean`

Create a application at the root of the workspace

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### skipNxJson

Default: `false`

Type: `boolean`

Skip updating `nx.json` with default options based on values provided to this app.

#### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

#### unitTestRunner

Default: `none`

Type: `string`

Possible values: `vitest`, `none`

Test runner to use for unit tests.
