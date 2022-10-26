## @nxext/stencil:application

Generate Stencil application

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
nx g @nxext/stencil:application ...
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

Possible values: `eslint`, `none`

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

## @nxext/stencil:component

Add a component to a ui library

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
nx g @nxext/stencil:component ...
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

#### directory

Alias(es): d

Type: `string`

A directory where the project is placed

#### skipFormat

Default: `false`

Type: `boolean`

## @nxext/stencil:add-outputtarget

Add react/angular libraries for the component library

### Usage

```bash
nx generate add-outputtarget ...
```

By default, Nx will search for `add-outputtarget` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/stencil:add-outputtarget ...
```

Show what will be generated without writing to disk:

```bash
nx g add-outputtarget ... --dry-run
```

### Options

#### outputType (_**required**_)

Type: `string`

Possible values: `angular`, `react`, `svelte`

Select what kind of library you want to generate.

#### projectName (_**required**_)

Type: `string`

Project for that the library should be generated.

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### publishable

Default: `false`

Type: `boolean`

#### skipFormat

Default: `false`

Type: `boolean`

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Adds the specified unit test runner.

## @nxext/stencil:make-lib-buildable

Make a library buildable

### Usage

```bash
nx generate make-lib-buildable ...
```

By default, Nx will search for `make-lib-buildable` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/stencil:make-lib-buildable ...
```

Show what will be generated without writing to disk:

```bash
nx g make-lib-buildable ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### importPath

Type: `string`

The library name used to import it, like @myorg/my-awesome-lib

#### style

Alias(es): s

Default: `css`

Type: `string`

Possible values: `css`, `scss`, `styl`, `less`, `pcss`

The file extension to be used for style files.

## @nxext/stencil:storybook-configuration

storybook-configuration generator

### Usage

```bash
nx generate storybook-configuration ...
```

By default, Nx will search for `storybook-configuration` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/stencil:storybook-configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g storybook-configuration ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

Library or application name

#### configureCypress

Type: `boolean`

Run the cypress-configure generator

#### cypressDirectory

Type: `string`

A directory where the Cypress project will be placed. Added at root by default.

#### linter

Default: `eslint`

Type: `string`

Possible values: `eslint`, `none`

The tool to use for running lint checks.

#### standaloneConfig

Default: `false`

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside workspace.json
