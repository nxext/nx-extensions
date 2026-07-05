import { Tree } from '@nx/devkit';
import {
  addFrameworkDependencies,
  FrameworkDependencyMap,
} from '@nxext/common';
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

const svelteFrameworkDependencies: FrameworkDependencyMap = {
  dependencies: {},
  devDependencies: {
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
  },
};

export function updateDependencies(tree: Tree) {
  return addFrameworkDependencies(tree, svelteFrameworkDependencies);
}
