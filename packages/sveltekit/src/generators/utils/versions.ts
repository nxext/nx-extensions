export const eslintPluginSvelteVersion = '^3.20.0';
export const svelteVersion = '^5.0.0';
export const svelteKitVersion = '^2.20.0';
export const svelteKitAdapterVersion = '^7.0.0';
// @sveltejs/kit declares `@sveltejs/vite-plugin-svelte` as a *required*
// peerDependency (`^3.0.0 || ^4.0.0-next.1 || ^5.0.0 || ^6.0.0-next.0 || ^7.0.0`)
// and our generated `svelte.config.js` imports `vitePreprocess` from it
// directly, so it must be declared explicitly rather than relying on it
// being hoisted transitively. v7 is the newest major in that peer range,
// and its own peer (`vite: ^8.0.0-beta.7 || ^8.0.0`) matches what @nx/vite
// installs by default for newly generated projects (see
// @nx/vite/src/utils/versions.ts `viteVersion`), same choice as the plain
// `svelte` package.
export const vitePluginSvelteVersion = '^7.0.0';
