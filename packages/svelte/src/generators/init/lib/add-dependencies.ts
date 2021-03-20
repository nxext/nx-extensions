import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

export function updateDependencies(tree: Tree) {
  return addDependenciesToPackageJson(
    tree,
    {},
    {
      'svelte-jester': '^1.3.0',
      svelte: '^3.35.0',
      'svelte-check': '^1.2.3',
      'svelte-preprocess': '^4.6.9',
      '@tsconfig/svelte': '^1.0.10',
      '@testing-library/svelte': '^3.0.3',
      'rollup-plugin-local-resolve': '^1.0.7',
    }
  );
}
