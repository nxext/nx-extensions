import { default as update } from './check-for-index-html';
import { Tree } from '@nx/devkit';
import { createTestProject } from '../../generators/utils/testing';
import { uniq } from '@nx/plugin/testing';

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

  it(`should add new index.html`, async () => {
    tree.delete(`apps/${appName}/index.html`);

    await update(tree);

    expect(tree.exists(`apps/${appName}/index.html`)).toBeTruthy();
    expect(tree.exists(`apps/${appName}/index.html.backup`)).toBeFalsy();
  });

  it(`should add new index.html and save the old one`, async () => {
    await update(tree);

    expect(tree.exists(`apps/${appName}/index.html`)).toBeTruthy();
    expect(tree.exists(`apps/${appName}/index.html.backup`)).toBeTruthy();
  });

  it(`should add new index.html and save the old one`, async () => {
    await update(tree);

    expect(tree.exists(`libs/${libName}/index.html`)).toBeFalsy();
  });
});
