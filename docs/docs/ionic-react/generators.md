## @nxext/ionic-react:application

Create an Ionic React application.

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
nx g @nxext/ionic-react:application ...
```

Show what will be generated without writing to disk:

```bash
nx g application ... --dry-run
```

### Examples

Generate apps/myorg/myapp and apps/myorg/myapp-e2e:

```bash
nx g app myapp --directory=myorg
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

#### standaloneConfig

Type: `boolean`

Split the project configuration into `<projectRoot>/project.json` rather than including it inside `workspace.json`.

#### tags

Alias(es): t

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
