---
id: third-party
title: Third-party integration
---

## Storybook

You can generate Storybook configuration for an individual project with this command:

```
nx g @nxext/stencil:storybook-configuration my-lib
```

To run the generated Storybook use:

```
nx storybook my-lib
```

_The Storybook startup needs an successful `nx build` cause of the generated loaders to work_

## React, Angular and Vue

You're able to generate angular/react libraries for yout stencil libraries using stencils outputtargets:

```
nx g @nxext/stencil:add-outputtarget my-lib
```

With the `--outputType='react'`, `--outputType='angular'` or `--outputType='vue'` you can define the kind of library.

## Capacitor App

You're able to generate a StencilJs and Capacitor based mobile app.

```
nx g @nxext/stencil:ionic-app myapp
```

After that build it and follow the given instructions to add capacitors platform platforms. (look [here](https://nxtend.dev/docs/capacitor/getting-started) for the nx capacitor plugin documentation.)
