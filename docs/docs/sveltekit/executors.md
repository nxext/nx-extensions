---
sidebarDepth: 3
---

## @nxext/sveltekit:sveltekit

sveltekit executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### command (_**required**_)

Type: `string`

Sveltekit command to run

#### port

Default: `3000`

Type: `number`

Port to listen on.

## @nxext/sveltekit:add

add executor

Options can be configured in the 'project.json' when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/configuration/projectjson#targets.

### Options

#### package (_**required**_)

Type: `string`

Possible values: `tailwindcss`, `mdsvex`, `graphql`, `postcss`, `bulma`, `windicss`, `firebase-hosting`

Package you want to install
