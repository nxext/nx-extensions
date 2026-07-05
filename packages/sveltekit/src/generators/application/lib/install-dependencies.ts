import { addDependenciesToPackageJson, Tree } from '@nx/devkit';
import {
  svelteKitAdapterVersion,
  svelteKitVersion,
  svelteVersion,
  vitePluginSvelteVersion,
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
      // required peerDependency of @sveltejs/kit; also imported directly by
      // the generated svelte.config.js for `vitePreprocess`.
      '@sveltejs/vite-plugin-svelte': vitePluginSvelteVersion,
    }
  );
}
