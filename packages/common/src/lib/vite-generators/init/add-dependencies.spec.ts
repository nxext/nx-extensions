import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree } from '@nx/devkit';
import { addFrameworkDependencies } from './add-dependencies';

describe('addFrameworkDependencies', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('writes dependencies and devDependencies into the root package.json (preact/solid/svelte add-dependencies.ts shape)', () => {
    addFrameworkDependencies(tree, {
      dependencies: { preact: '10.0.0' },
      devDependencies: { '@testing-library/preact': '3.0.0' },
    });

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['preact']).toBe('10.0.0');
    expect(packageJson.devDependencies['@testing-library/preact']).toBe(
      '3.0.0',
    );
  });
});
