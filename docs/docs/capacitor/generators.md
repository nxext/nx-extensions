## @nxext/capacitor:configuration

Configure Capacitor for an Nx project

### Usage

```bash
nx generate configuration ...
```

By default, Nx will search for `configuration` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/capacitor:configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g configuration ... --dry-run
```

### Options

#### project (_**required**_)

Alias(es): p

Type: `string`

The name of the frontend project for Capacitor.

#### appId

Default: `io.ionic.starter`

Type: `string`

The app ID for the project.

#### appName

Type: `string`

The application name for the project.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.

#### webDir

Type: `string`

The directory of your projects built web assets.
