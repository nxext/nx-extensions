## @nxext/ionic-angular:application

Create an Ionic Angular application.

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
nx g @nxext/ionic-angular:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

The name of the application.

#### capacitor

Default: `true`

Type: `boolean`

Generate a Capacitor project.

#### directory

Alias(es): d

Type: `string`

The directory of the new application.

#### e2eTestRunner

Default: `cypress`

Type: `string`

Possible values: `cypress`, `none`

Test runner to use for end to end (e2e) tests.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### tags

Type: `string`

Add tags to the application (used for linting).

#### template

Default: `blank`

Type: `string`

Possible values: `blank`, `list`, `sidemenu`, `tabs`

The starter template to use.

#### unitTestRunner

Default: `jest`

Type: `string`

Possible values: `jest`, `none`

Test runner to use for unit tests.

## @nxext/ionic-angular:page

Generate an Ionic page component

### Usage

```bash
nx generate page ...
```

By default, Nx will search for `page` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/ionic-angular:page ...
```

Show what will be generated without writing to disk:

```bash
nx g page ... --dry-run
```

### Options

#### name (_**required**_)

Type: `string`

#### project (_**required**_)

Alias(es): p

Type: `string`

The name of the project.

#### directory

Alias(es): d

Type: `string`

A directory where the page is created
