# Migration

# 1.x.x - 2.0.0

## Updated Ionic Starter Templates

The Ionic starter templates have been updated, and while these changes are not necessary, you may want to apply them.

### Add color-scheme Meta Tag

The `color-scheme` meta tag was added to `index.html` in the Ionic React base starter template. Add this meta tag inside the head tag of your `index.html`:

```
<meta name="color-scheme" content="light dark" />
```

https://github.com/ionic-team/starters/pull/1201/files#diff-18fbed2ce2b3ac6650ea6b56540f0612

### Update Theming Vars

The theme variables have been updated in the Ionic React base starter template. Update the iOS and Material Design dark theme variables:

```
  /*
   * iOS Dark Theme
   * -------------------------------------------
   */
  .ios body {
    --ion-background-color: #000000;
    --ion-background-color-rgb: 0,0,0;
    --ion-text-color: #ffffff;
    --ion-text-color-rgb: 255,255,255;
    --ion-color-step-50: #0d0d0d;
    --ion-color-step-100: #1a1a1a;
    --ion-color-step-150: #262626;
    --ion-color-step-200: #333333;
    --ion-color-step-250: #404040;
    --ion-color-step-300: #4d4d4d;
    --ion-color-step-350: #595959;
    --ion-color-step-400: #666666;
    --ion-color-step-450: #737373;
    --ion-color-step-500: #808080;
    --ion-color-step-550: #8c8c8c;
    --ion-color-step-600: #999999;
    --ion-color-step-650: #a6a6a6;
    --ion-color-step-700: #b3b3b3;
    --ion-color-step-750: #bfbfbf;
    --ion-color-step-800: #cccccc;
    --ion-color-step-850: #d9d9d9;
    --ion-color-step-900: #e6e6e6;
    --ion-color-step-950: #f2f2f2;

    --ion-toolbar-background: #0d0d0d;

    --ion-item-background: #000000;
  }


  /*
   * Material Design Dark Theme
   * -------------------------------------------
   */
  .md body {
    --ion-background-color: #121212;
    --ion-background-color-rgb: 18,18,18;
    --ion-text-color: #ffffff;
    --ion-text-color-rgb: 255,255,255;
    --ion-border-color: #222222;
    --ion-color-step-50: #1e1e1e;
    --ion-color-step-100: #2a2a2a;
    --ion-color-step-150: #363636;
    --ion-color-step-200: #414141;
    --ion-color-step-250: #4d4d4d;
    --ion-color-step-300: #595959;
    --ion-color-step-350: #656565;
    --ion-color-step-400: #717171;
    --ion-color-step-450: #7d7d7d;
    --ion-color-step-500: #898989;
    --ion-color-step-550: #949494;
    --ion-color-step-600: #a0a0a0;
    --ion-color-step-650: #acacac;
    --ion-color-step-700: #b8b8b8;
    --ion-color-step-750: #c4c4c4;
    --ion-color-step-800: #d0d0d0;
    --ion-color-step-850: #dbdbdb;
    --ion-color-step-900: #e7e7e7;
    --ion-color-step-950: #f3f3f3;

    --ion-item-background: #1e1e1e;

    --ion-toolbar-background: #1f1f1f;

    --ion-tab-bar-background: #1f1f1f;
  }
```

https://github.com/ionic-team/starters/pull/1202/files#diff-55074cec577e0428be6a1c0b2187de47

### Remove Unneeded Toolbar and Large Title Patches

There was an unresolved issue when Ionic 5.0 was released that required addional CSS to properly display the toolbar and large title. You can safely remove this style from all pages:

```
ion-content ion-toolbar {
  --background: transparent;
}
```

https://github.com/ionic-team/starters/blob/fb440a44b234989eaf6d11ed4091590308e8bb72/react/official/blank/src/pages/Home.css
