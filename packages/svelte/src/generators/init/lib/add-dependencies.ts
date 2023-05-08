import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  svelteCheckVersion,
  svelteJesterVersion,
  sveltePreprocessVersion,
  svelteVersion,
  testingLibrarySvelteVersion,
  tsconfigSvelteVersion,
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
    }
  );
}
