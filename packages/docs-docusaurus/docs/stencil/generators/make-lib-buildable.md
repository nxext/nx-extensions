---
id: make-lib-buildable
title: Make lib buildable
---

Adds build and e2e executors to a not yet buildable library:

## Usage

```
nx g @nxext/stencil:make-lib-buildable my-lib
```

or

```
ng g @nxext/stencil:make-lib-buildable my-lib
```

## Options

### --style

Default: `css`

Possible values: css, scss, styl, less, pcss

Type: `list`

The file extension to be used for style files.
