import { ViteFrameworkConfig } from '@nxext/common';

/**
 * Describes how the preact vite plugin is wired into the generated
 * `vite.config.ts` for both the application and library generators. Shared
 * so `configureViteFrameworkPlugin` produces the exact same
 * import/plugin-call expressions (`import preact from '@preact/preset-vite'`
 * / `preact()`) that the previous, per-generator `createOrEditViteConfig`
 * calls used.
 */
export const preactViteFrameworkConfig: ViteFrameworkConfig = {
  frameworkName: 'preact',
  plugin: {
    importStatement: `import preact from '@preact/preset-vite'`,
    pluginCallExpression: 'preact()',
  },
};
