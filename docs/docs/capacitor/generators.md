---
sidebarDepth: 3
---

## @nxext/capacitor:capacitor-project

Add a Capacitor project

### Usage

```bash
nx generate capacitor-project ...
```

By default, Nx will search for `capacitor-project` in the default collection provisioned in nx.json.

You can specify the collection explicitly as follows:

```bash
nx g @nxext/capacitor:capacitor-project ...
```

Show what will be generated without writing to disk:

```bash
nx g capacitor-project ... --dry-run
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
