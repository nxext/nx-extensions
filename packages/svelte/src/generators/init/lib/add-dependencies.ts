import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'svelte-jester': '^1.3.2',
      svelte: '^3.44.2',
      'svelte-check': '^1.4.0',
      'svelte-preprocess': '^4.9.8',
      '@tsconfig/svelte': '^2.0.1',
      '@testing-library/svelte': '^3.0.3',
      '@sveltejs/vite-plugin-svelte': '^1.0.0-next.32',
    }
  );
}
