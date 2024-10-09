# Getting Started

## Install Plugin

This plugin does need the angular and capacitor plugin, so add them to your Nx workspace:

```bash
npm install @nx/angular --save-dev
npm install @nxext/ionic-angular --save-dev
```

## Add Ionic-angular to a new Project

1. _Optional_ generate the new project : _[Nx doc](https://nx.dev/nx-api/angular)_  
   `nx g @nx/angular:application my-app --directory=apps/my-app`
2. Now, change the configuration of the app, to support ionic-angular: _[Nxext doc](./generators)_  
   `nx g @nxext/ionic-angular:configuration my-app`

### Capacitor

Running the configuration generator will set up the Capacitor CLI by

- Adding new targets inside your `project.json`.

These targets let you interact with the [Capacitor CLI](https://capacitorjs.com/docs/cli).  
_See the [related documentation](/docs/capacitor/overview) for more details._

## Add Capacitor to an existing project

3. Follow the step `1.` and `2.` as they are **required**.  
   _This library isn't ment to replace `@nx/angular` but just to add an additional logic_
4. Now, every `@capacitor` module will have to be declared inside the newly created `package.json` like follow

```jsonc
// ./apps/my-app/package.json
{
  "name": "my-app",
  "devDependencies": {
    "@capacitor/android": "../../node_modules/@capacitor/android",
    "@capacitor/app": "../../node_modules/@capacitor/app",
    "@capacitor/cli": "../../node_modules/@capacitor/cli",
    "@capacitor/core": "../../node_modules/@capacitor/core",
    "@capacitor/ios": "../../node_modules/@capacitor/ios",

    // Example of a new capacitor plugin
    "@capacitor-community/apple-sign-in": "../../node_modules/@capacitor-community/apple-sign-in",
    "@capacitor/camera": "../../node_modules/@capacitor/camera"
  }
}
```

## Add Native Platforms

8. Add the native `android` and `ios` platforms

```
nx run my-app:add:ios
nx run my-app:add:android
```

## Sync Native Platform

9. Running the sync command will update the native platform dependencies and copy a build of your frontend project to the Capacitor project:

```
nx run my-app:sync:ios
nx run my-app:sync:android
```

## Additional: Podfile

10. You may want to, (re)init your Podfile  
    a. Open the `my-app/ios/App` folder in your terminal
    b. Run `pod install`

## Open Native platform

11. Finally, you can open the native platform in it's respective IDE:

```
nx run my-app:open:ios
nx run my-app:open:android
```

## Migrate from non nx repo

5. Follow steps `1. - 3.`
6. Copy your code inside your project
7. Follow by the step `4.` then `8. - 11.`

Should be now working, [open an issue](https://github.com/nxext/nx-extensions/issues) in case you encounter any errors
