---
id: schematics
title: Project schematics
sidebar_label: Schematics
---

Generate your projects:

```
nx g @nxext/stencil:app my-app
nx g @nxext/stencil:pwa my-app
nx g @nxext/stencil:lib my-lib
```

each generator is able to generate your template with different style variants. Supported are:

```
--style=css (default)
--style=scss
--style=less
--style=styl
--style=pcss
```

You can generate components with:

```
nx g @nxext/stencil:component my-comp
```

or

```
nx g @nxext/stencil:c my-comp
```

If [Storybook](third-party#storybook) is configured a `<my-comp>.stories.ts` is generated.
