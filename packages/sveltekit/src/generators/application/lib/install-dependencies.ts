import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  svelteKitAdapterVersion,
  svelteKitVersion,
  svelteVersion,
} from '../../utils/versions';
import { SveltekitGeneratorSchema } from '../schema';

export function installDependencies(
  host: Tree,
  options: SveltekitGeneratorSchema
) {
  return addDependenciesToPackageJson(
    host,
    {},
    {
      '@sveltejs/adapter-auto':
        options.adapterVersion || svelteKitAdapterVersion,
      '@sveltejs/kit': options.svelteKitVersion || svelteKitVersion,
      svelte: options.svelteVersion || svelteVersion,
    }
  );
}
