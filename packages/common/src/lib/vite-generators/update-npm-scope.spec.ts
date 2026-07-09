import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, Tree, writeJson } from '@nx/devkit';
import {
  shouldUpdateNpmScope,
  updateLibPackageNpmScope,
} from './update-npm-scope';

describe('updateLibPackageNpmScope', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
    writeJson(tree, 'libs/my-lib/package.json', {
      name: 'my-lib',
      version: '0.0.1',
    });
  });

  it('overwrites the package.json name with importPath (preact/solid/svelte behavior)', () => {
    updateLibPackageNpmScope(tree, {
      projectRoot: 'libs/my-lib',
      importPath: '@myorg/my-lib',
    });

    const packageJson = readJson(tree, 'libs/my-lib/package.json');
    expect(packageJson.name).toBe('@myorg/my-lib');
    // untouched fields stay untouched
    expect(packageJson.version).toBe('0.0.1');
  });
});

describe('shouldUpdateNpmScope', () => {
  // Mirrors the three existing call sites' condition:
  // preact: `options.buildable || options.publishable`
  // solid:  `options.publishable || options.buildable`
  // svelte: `options.publishable || options.buildable`
  it.each`
    buildable    | publishable  | expected
    ${true}      | ${undefined} | ${true}
    ${undefined} | ${true}      | ${true}
    ${true}      | ${true}      | ${true}
    ${false}     | ${false}     | ${false}
    ${false}     | ${undefined} | ${false}
    ${undefined} | ${undefined} | ${false}
  `(
    'returns $expected for buildable=$buildable, publishable=$publishable',
    ({ buildable, publishable, expected }) => {
      expect(shouldUpdateNpmScope({ buildable, publishable })).toBe(expected);
    },
  );
});
