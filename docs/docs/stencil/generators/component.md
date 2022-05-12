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
