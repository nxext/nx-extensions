import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import {
  angularSchematicsVersion,
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
      // Resolves https://github.com/nxext/nx-extensions/issues/580
      '@angular-devkit/schematics': angularSchematicsVersion,
      '@sveltejs/adapter-node': svelteKitAdapterVersion,
      '@sveltejs/kit': svelteKitVersion,
      svelte: svelteVersion,
      'svelte-preprocess': sveltePreprocessVersion,
    }
  );
}
