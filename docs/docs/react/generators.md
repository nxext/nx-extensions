## @nxext/react:application

Create an application

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
nx g @nxext/react:application ...
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

Use class components instead of functional components:

```bash
nx g app myapp --classComponent
```

Set up React Router:

```bash
nx g app myapp --routing
```

### Options

#### classComponent

Alias(es): C

Default: `false`

Type: `boolean`

Use class components instead of functional component.

#### directory

Alias(es): dir

Type: `string`

The directory of the new application.

#### globalCss

Default: `false`

Type: `boolean`

Default is false. When true, the component is generated with _.css/_.scss instead of _.module.css/_.module.scss

#### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files.

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

#### routing

Default: `false`

Type: `boolean`

Generate application with routes.

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

#### strict

Default: `true`

Type: `boolean`

Creates an application with strict mode and strict type checking

#### style

Alias(es): s

Default: `css`

Type: `string`

Possible values: `css`, `scss`, `styl`, `less`, `styled-components`, `@emotion/styled`, `styled-jsx`, `none`

The file extension to be used for style files.

#### tags

Alias(es): t

Type: `string`

Add tags to the application (used for linting).

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.

## @nxext/react:library

Create a library

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
nx g @nxext/react:library ...
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

Generate a library with routes and add them to myapp:

```bash
nx g lib mylib --appProject=myapp
```

### Options

#### name (_**required**_)

Type: `string`

Library name

#### appProject

Alias(es): a

Type: `string`

The application project to add the library route to.

#### buildable

Default: `false`

Type: `boolean`

Generate a buildable library.

#### component

Default: `true`

Type: `boolean`

Generate a default component.

#### directory

Alias(es): dir

Type: `string`

A directory where the lib is placed.

#### globalCss

Default: `false`

Type: `boolean`

When true, the stylesheet is generated using global CSS instead of CSS modules (e.g. file is '_.css' rather than '_.module.css').

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files.

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

#### routing

Type: `boolean`

Generate library with routes.

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

#### strict

Default: `true`

Type: `boolean`

Whether to enable tsconfig strict mode or not.

#### style

Alias(es): s

Default: `css`

Type: `string`

Possible values: `css`, `scss`, `styl`, `less`, `styled-components`, `@emotion/styled`, `styled-jsx`, `none`

The file extension to be used for style files.

#### tags

Alias(es): t

Type: `string`

Add tags to the library (used for linting).

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.
