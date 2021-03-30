import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  svelteKitAdapterVersion,
  svelteKitVersion,
  sveltePreprocessVersion,
  svelteVersion,
  viteVersion
} from '../../utils/versions';

export function installDependencies(host: Tree) {
  return addDependenciesToPackageJson(host, {}, {
    '@sveltejs/adapter-node': svelteKitAdapterVersion,
    '@sveltejs/kit': svelteKitVersion,
    'svelte': svelteVersion,
    'vite': viteVersion,
    'svelte-preprocess': sveltePreprocessVersion
  });
}
