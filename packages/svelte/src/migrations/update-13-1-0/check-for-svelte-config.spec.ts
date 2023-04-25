import { default as update } from './check-for-svelte-config';
import { Tree } from '@nx/devkit';
import { createTestProject } from '../../generators/utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';

describe('check-for-svelte-config', () => {
  let tree: Tree;
  const appName = uniq('app');
  const libName = uniq('lib');

  beforeEach(async () => {
    tree = await createTestProject(appName, 'application');
    tree.delete(`apps/${appName}/svelte.config.cjs`);
    tree = await createTestProject(libName, 'library', tree);
    tree.delete(`libs/${libName}/svelte.config.cjs`);
  });

  it(`should add app svelte.config.cjs`, async () => {
    await update(tree);

    expect(tree.exists(`apps/${appName}/svelte.config.cjs`)).toBeTruthy();
  });

  it(`should add lib svelte.config.cjs`, async () => {
    await update(tree);

    expect(tree.exists(`libs/${libName}/svelte.config.cjs`)).toBeTruthy();
  });
});
