# @nxext/sveltekit

This library is experimental, be aware...

Right now there are the `app` and `component` generators.

## Getting Started

Add this plugin to an existing NX workspace:

```bash
yarn add --dev @nxext/sveltekit
```

or

```bash
npm install @nxext/sveltekit --save-dev
```

Generate a new application:

```bash
nx g @nxext/sveltekit:app my-app
```

## Run executors and generators using nx

The `project.json` is for the sveltekit app is preconfigured with the following Nx targets

- Run `nx build my-app` to build the app
- Run `nx serve my-app` to serve the app
- Run `nx dev my-app` to serve the app on a dev server
- Run `nx preview my-app` to serve the app on a preview server
- Run `nx test my-app` to test the app
- Run `nx e2e my-app` to run the e2e tests
- Run `nx check my-app` to check the app via svelte-check
- Run `nx lint my-app` to lint the app
- Run `nx add my-app` to add a package to the app
- Run `nx component my-app` to add a component to the app
- Run `nx page my-app` to add a page to the app

## Generate routes

Routes will be generated relative to the `routes` folder of the app.
Use the `targetPath` (or `t` alias) option to specify the parent route folder target of the route

Generate a route `posts` in the root `/routes` folder.
The page will have additional client page data loader `c`

```
nx route posts -d
```

Generate the route `[slug]` in the `routes/posts` folder of the app
The route will have a page `p`, client page data loader `c` and a layout page `l`.

```
nx route [slug] -pdl -t posts
```

Generate the route `[width]x[height]` in the `routes/images/[...file]` folder.
The route will have a page `p`, client data loader `c`, layout page `l` and an error page `e`

```
nx route [width]x[height] -pdle -t images/[...file]
```

Generate the route `posts` in the `routes/api` folder.
The route will have a server API file `a` with endpoint for the HTTP methods `m` GET `get` and POST `post` and a server loader file `s`

```
nx route posts -t api -a -s -m get,post
```

## Run your project

> Note: you may see an error in your command line when you run any of the following commands with older versions of this extension: `config.kit.target is no longer required, and should be removed`. If you see this error, remove the `kit` object from your `svelte.config.js` file at the root of your app.

- Run `nx serve my-app` to run the app locally (open http://localhost:3000 in your browser)
- Run `nx test my-app` to test the app
- Run `nx build my-app` to create a build of your app.

## Documentation

The full docs can be found [here](https://nxext.dev/docs/sveltekit/overview).
