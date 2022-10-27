## @nxext/vite:application

Create a vite application

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
nx g @nxext/vite:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Examples

Generate apps/myorg/myapp:

```bash
nx g app myapp --directory=myorg
```

### Options

#### directory

Alias(es): dir

Type: `string`

The directory of the new application.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### name

Type: `string`

The name of the application.

#### pascalCaseFiles

Alias(es): P

Default: `false`

Type: `boolean`

Use pascal case component file name (e.g. App.tsx).

#### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### skipWorkspaceJson

Default: `false`

Type: `boolean`

Skip updating workspace.json with default options based on values provided to this app (e.g. babel, style).

#### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json

#### supportJSX

Default: `true`

Type: `boolean`

Add support for JSX/TSX

#### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `vitest`, `jest`, `none`

Test runner to use for unit tests.

## @nxext/vite:library

Create a vite library

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
nx g @nxext/vite:library ...
```

Show what will be generated without writing to disk:

```bash
nx g library ... --dry-run
```

### Examples

Generate libs/myapp/mylib:

```bash
nx g lib mylib --directory=myapp
```

### Options

#### name (_**required**_)

Type: `string`

Library name

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

#### directory

Alias(es): dir

Type: `string`

A directory where the lib is placed.

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### pascalCaseFiles

Alias(es): P

Default: `false`

Type: `boolean`

Use pascal case component file name (e.g. App.tsx).

#### publishable

Type: `boolean`

Create a publishable library.

#### setParserOptionsProject

Default: `false`

Type: `boolean`

Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### skipTsConfig

Default: `false`

Type: `boolean`

Do not update tsconfig.json for development experience.

#### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json

#### supportJSX

Default: `false`

Type: `boolean`

Add JSX/TSX support

#### tags

Alias(es): t

Type: `string`

Add tags to the library (used for linting).

#### unitTestRunner

Default: `vitest`

Type: `string`

Possible values: `vitest`, `jest`, `none`

Test runner to use for unit tests.
