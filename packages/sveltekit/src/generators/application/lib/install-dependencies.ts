import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  svelteKitAdapterVersion,
  svelteKitVersion,
  sveltePreprocessVersion,
  svelteVersion,
} from '../../utils/versions';

export function installDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@sveltejs/adapter-node': svelteKitAdapterVersion,
      '@sveltejs/kit': svelteKitVersion,
      svelte: svelteVersion,
      'svelte-preprocess': sveltePreprocessVersion,
    }
  );
}
