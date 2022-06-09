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
