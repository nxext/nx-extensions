import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { Schema } from '../schema';

export function updateDependencies(tree: Tree, schema: Schema) {
  let devDependencies = {
    'svelte-jester': '^1.3.2',
    svelte: '^3.42.6',
    'svelte-check': '^1.4.0',
    'svelte-preprocess': '^4.9.5',
    '@tsconfig/svelte': '^1.0.10',
    '@testing-library/svelte': '^3.0.3',
    'rollup-plugin-local-resolve': '^1.0.7',
  };
  if(schema?.bundler === 'vite') {
    devDependencies = {
      ...devDependencies,
      ...{'@sveltejs/vite-plugin-svelte': '^1.0.0-next.10'}
    };
  }

  return addDependenciesToPackageJson(
    tree,
    {},
    devDependencies
  );
}
