## `@nxext/ionic-angular` Plugin

### Overview

The `@nxext/ionic-angular` plugin configures Ionic and Capacitor for an Angular application in your Nx workspace.

### Installation

Install the plugin in your Nx workspace:

```bash
npm install @nxext/ionic-angular --save-dev
```

### Usage

1. **Generate a New Angular Project (Optional):**

   ```bash
   nx g @nx/angular:application --directory=apps/my-app
   ```

2. **Add Ionic and Capacitor Configuration:**

   ```bash
   nx g @nxext/ionic-angular:configuration my-app
   ```

:::info  
This plugin configures an existing Angular application.
If you don't have an application yet, visit the [Nx documentation](https://nx.dev/nx-api/angular) to generate one.  
:::

### Notes on Capacitor Plugins

Capacitor plugin dependencies must be added to the project-level `package.json`.

```jsonc
// ./apps/my-app/package.json
{
  "name": "my-app",
  "dependencies": {
    "@capacitor/android": "../../node_modules/@capacitor/android",
    "@capacitor/ios": "../../node_modules/@capacitor/ios",
    // Example plugin
    "@capacitor-community/apple-sign-in": "../../node_modules/@capacitor-community/apple-sign-in"
  }
}
```

#### Add Native Platforms

Add support for Android and iOS platforms:

```bash
nx run my-app:add:ios
nx run my-app:add:android
```

#### Sync Native Platforms

Update native platform dependencies and copy the built frontend to the Capacitor project:

```bash
nx run my-app:sync:ios
nx run my-app:sync:android
```

**For iOS Podfile Initialization:**

1. Navigate to the `ios/App` folder:
   ```bash
   cd apps/my-app/ios/App
   ```
2. Run `pod install`.

#### Open Native Platforms

Open the native project in the respective IDE:

```bash
nx run my-app:open:ios
nx run my-app:open:android
```
