## `@nxext/capacitor` Plugin

### Overview

The `@nxext/capacitor` plugin provides Nx targets to interact with the Capacitor CLI.

### Installation

Install the plugin in your Nx workspace:

```bash
npm install --save-dev @nxext/capacitor
```

#### Configure Capacitor

```bash
nx generate @nxext/capacitor:configuration --project=my-app
```

:::info  
This plugin configures an existing application.
If you don't have an application yet, visit the [Nx documentation](https://nx.dev/getting-started/intro#pick-your-stack) to generate one.  
:::

### Usage

#### Add Native Platforms

Add support for native platforms like Android and iOS:

```bash
nx run my-app:add:android
nx run my-app:add:ios
```

#### Sync Native Platforms

Sync the native platforms to update dependencies and copy the built frontend:

```bash
nx run my-app:sync:android
nx run my-app:sync:ios
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
nx run my-app:open:android
nx run my-app:open:ios
```

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
