The `@nxext/capacitor` plugin will be added to your workspace and a Capacitor project will be automatically generated with a new `@nxext/ionic-react` application. However, you can add Capacitor to an existing project.

## Install Plugin

```
# npm
npm install --save-dev --exact @nxext/capacitor

# yarn
yarn add --save-dev --exact @nxext/capacitor
```

## Add Capacitor to Existing Project

First, ensure that the frontend project has been built:

```
nx build {frontend project name}

nx build mobile-app
```

Once the plugin has been added to your Nx workspace you can generate a Capacitor project from an existing frontend project:

```
nx generate @nxext/capacitor:capacitor-project --project {frontend project name}

nx generate @nxext/capacitor:capacitor-project --project mobile-app
```

Nx will ask you some questions about the application, but you can customize it further by passing these options:

```
nx generate @nxext/capacitor:capacitor-project [options,...]

Options:
  --project               The name of the frontend project for Capacitor.
  --appId                 The app ID for the project. (default: io.ionic.starter)
  --appName               The application name for the project.
  --webDir                The directory of your projects built web assets.
  --skipFormat            Skip formatting files.
  --dryRun                Runs through and reports activity without writing to disk.
  --skip-nx-cache         Skip the use of Nx cache.
  --help                  Show available options for project target.
```

Finally, you will need to `cd` into your applications directory and install the npm dependencies. (e.g. `npm install`)

## Add Native Platforms

Now that a Capacitor project has been added to your Nx workspace you can begin adding support for native platforms. Currently, Capacitor supports Android and iOS, but other platforms can be added with Capacitor plugins.

```
nx run {frontend project}:add:ios
nx run {frontend project}:add:android
nx run {frontend project}:add --platform {native platform}

nx run my-app:add:android
nx run my-app:cap --cmd="add android"
```

## Sync Native Platform

Running the sync command will update the native platform dependencies and copy a build of your frontend project to the Capacitor project:

```
nx run {frontend project}:sync:ios
nx run {frontend project}:sync:android
nx run {frontend project}:sync --platform {native platform}

nx run my-app:sync:android
nx run my-app:cap --cmd="sync android"
```

## Open Native Platform

Finally, you can open the native platform in it's respective IDE:

```
nx run {frontend project}:open:ios
nx run {frontend project}:open:android
nx run {frontend project}:open --platform {native platform}

nx run my-app:open:android
nx run my-app:cap --cmd="open android"
```

## Adding Capacitor Plugins

Capacitor plugin dependencies must be added to the project-level `package.json`.

To learn more about Capacitor, including the native API's available, please read the [official Capacitor documentation](https://capacitorjs.com/docs).
