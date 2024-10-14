## @nxext/svelte:application

Svelte application schematic

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
nx g @nxext/svelte:application ...
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

#### host

Default: `localhost`

Type: `string`

Host to listen on.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### name

Alias(es): n

Type: `string`

A name of the project.

#### port

Default: `5000`

Type: `number`

Port to listen on.

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

Possible values: `jest`, `vitest`, `none`

Test runner to use for unit tests.

## @nxext/svelte:library

Svelte library schematic

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
nx g @nxext/svelte:library ...
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

Default: `vitest`

Type: `string`

Possible values: `jest`, `vitest`, `none`

Test runner to use for unit tests.

## @nxext/svelte:component

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
nx g @nxext/svelte:component ...
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

## @nxext/svelte:storybook-configuration

storybook-configuration generator

### Usage

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

### Options

#### name (_**required**_)

Type: `string`

Library or application name

#### interactionTests

Type: `boolean`

Add a Storybook Test-Runner target.

#### js

Default: `false`

Type: `boolean`

Generate JavaScript files rather than TypeScript files

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json

#### tsConfiguration

Default: `false`

Type: `boolean`

Configure your project with TypeScript. Generate main.ts and preview.ts files, instead of main.js and preview.js.
