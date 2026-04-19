import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  svelteCheckVersion,
  svelteJesterVersion,
  sveltePreprocessVersion,
  svelteVersion,
  testingLibrarySvelteVersion,
  tsconfigSvelteVersion,
  typesNodeVersion,
  vitePluginDtsVersion,
  vitePluginSvelteVersion,
} from '../../utils/versions';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'svelte-jester': svelteJesterVersion,
      svelte: svelteVersion,
      'svelte-check': svelteCheckVersion,
      'svelte-preprocess': sveltePreprocessVersion,
      '@tsconfig/svelte': tsconfigSvelteVersion,
      '@testing-library/svelte': testingLibrarySvelteVersion,
      '@sveltejs/vite-plugin-svelte': vitePluginSvelteVersion,
      // Emitted tsconfigs reference `types: ['node']`; install the types to
      // match.
      '@types/node': typesNodeVersion,
      // Needed for the library vite config (includeLib: true) which imports
      // vite-plugin-dts for declaration emission.
      'vite-plugin-dts': vitePluginDtsVersion,
    }
  );
}
