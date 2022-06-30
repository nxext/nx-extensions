/* eslint-disable @typescript-eslint/no-unused-vars */
import { addDependenciesToPackageJson, Tree } from '@nxext/devkit';
import { readNxVersion } from '../../generators/init/lib/util';
import { eslintPluginSvelteVersion } from '../../generators/utils/versions';

export default function update(host: Tree) {
  const nxVersion = readNxVersion(host);

  addDependenciesToPackageJson(
    host,
    {},
    {
      '@nrwl/cypress': nxVersion,
      '@nrwl/linter': nxVersion,
      '@nrwl/jest': nxVersion,
      'eslint-plugin-svelte3': eslintPluginSvelteVersion,
    }
  );
}
