import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  svelteKitAdapterVersion,
  svelteKitVersion,
  svelteVersion,
} from '../../utils/versions';

export function installDependencies(host: Tree) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@sveltejs/adapter-auto': svelteKitAdapterVersion,
      '@sveltejs/kit': svelteKitVersion,
      svelte: svelteVersion,
    }
  );
}
