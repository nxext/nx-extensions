## @nxext/ionic-react:configuration

Configure Ionic for a React application.

### Usage

```bash
nx generate configuration ...
```

By default, Nx will search for `configuration` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/ionic-react:configuration ...
```

Show what will be generated without writing to disk:

```bash
nx g configuration ... --dry-run
```

### Options

#### project (_**required**_)

Type: `string`

The name of the project.

#### capacitor

Default: `true`

Type: `boolean`

Generate a Capacitor project.

#### skipFormat

Default: `false`

Type: `boolean`

Skip formatting files.
