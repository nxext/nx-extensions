export const svelteVersion = '^5.0.0';
export const svelteJesterVersion = '^5.0.0';
export const svelteCheckVersion = '^4.0.0';
export const svelteLoaderVersion = '^3.1.9';
export const sveltePreprocessVersion = '^6.0.3';
export const eslintPluginSvelteVersion = '^3.20.0';
export const tsconfigSvelteVersion = '^5.0.0';
export const testingLibrarySvelteVersion = '^5.0.0';
// @sveltejs/vite-plugin-svelte v7 is the major whose peer range
// (vite ^8.0.0-beta.7 || ^8.0.0) matches what @nx/vite actually installs by
// default for newly generated projects (its `viteVersion` constant is
// `^8.0.0`, see @nx/vite/src/utils/versions.ts). v7 also requires
// svelte ^5.46.4, which the latest 5.x resolves to (5.56.4 at time of
// writing), so it stays compatible with svelteVersion above.
export const vitePluginSvelteVersion = '^7.0.0';
export const vitePluginDtsVersion = '^3.9.1';
export const typesNodeVersion = '^20.0.0';
