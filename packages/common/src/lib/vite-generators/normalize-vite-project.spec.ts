import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, updateJson } from '@nx/devkit';
import {
  normalizeViteAppCore,
  normalizeViteLibCore,
} from './normalize-vite-project';

describe('normalizeViteAppCore', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('resolves projectName/projectRoot/parsedTags and non-root e2e fields with a directory (preact-style: rootProject undefined)', async () => {
    const result = await normalizeViteAppCore(
      tree,
      { directory: 'apps/my-app', tags: 'one, two' },
      'application'
    );

    expect(result.projectName).toBe('my-app');
    expect(result.projectRoot).toBe('apps/my-app');
    expect(result.parsedTags).toEqual(['one', 'two']);
    expect(result.e2eProjectName).toBe('my-app-e2e');
    expect(result.e2eProjectRoot).toBe('apps/my-app-e2e');
    expect(result.e2eWebServerTarget).toBe('serve');
    expect(result.e2eWebServerAddress).toBe('http://localhost:4200');
  });

  it('defaults parsedTags to an empty array when tags is not provided', async () => {
    const result = await normalizeViteAppCore(
      tree,
      { directory: 'apps/my-app' },
      'application'
    );

    expect(result.parsedTags).toEqual([]);
  });

  it('a directory takes precedence over rootProject:true (determineProjectNameAndRootOptions only consults rootProject when directory is falsy) — matches solid/svelte behavior for non-root apps', async () => {
    const result = await normalizeViteAppCore(
      tree,
      { directory: 'apps/my-app', rootProject: true },
      'application'
    );

    expect(result.projectRoot).toBe('apps/my-app');
    expect(result.e2eProjectName).toBe('my-app-e2e');
    expect(result.e2eProjectRoot).toBe('apps/my-app-e2e');
  });

  it('rootProject:true without a directory resolves projectRoot to "." and uses the root e2e naming (solid/svelte-style)', async () => {
    const result = await normalizeViteAppCore(
      tree,
      { name: 'root-app', directory: '', rootProject: true },
      'application'
    );

    expect(result.projectRoot).toBe('.');
    expect(result.e2eProjectName).toBe('e2e');
    expect(result.e2eProjectRoot).toBe('e2e');
  });

  it('rootProject left undefined without a directory never resolves to root paths (preact-style: always non-root)', async () => {
    const result = await normalizeViteAppCore(
      tree,
      { name: 'my-app', directory: '' },
      'application'
    );

    expect(result.projectRoot).not.toBe('.');
    expect(result.e2eProjectName).toBe('my-app-e2e');
    expect(result.e2eProjectRoot).toBe(`${result.projectRoot}-e2e`);
  });

  it('reads the configured serve port from nx.json targetDefaults for e2eWebServerAddress', async () => {
    updateJson(tree, 'nx.json', (json) => {
      json.targetDefaults ??= {};
      json.targetDefaults.serve = { options: { port: 4321 } };
      return json;
    });

    const result = await normalizeViteAppCore(
      tree,
      { directory: 'apps/my-app' },
      'application'
    );

    expect(result.e2eWebServerAddress).toBe('http://localhost:4321');
  });
});

describe('normalizeViteLibCore', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  it('resolves projectName/projectRoot/parsedTags/importPath for a library with a directory', async () => {
    const result = await normalizeViteLibCore(tree, {
      directory: 'libs/my-lib',
      tags: 'a,b',
    });

    expect(result.projectName).toBe('my-lib');
    expect(result.projectRoot).toBe('libs/my-lib');
    expect(result.parsedTags).toEqual(['a', 'b']);
    expect(typeof result.importPath).toBe('string');
  });

  it('honors an explicit importPath', async () => {
    const result = await normalizeViteLibCore(tree, {
      directory: 'libs/my-lib',
      importPath: '@myorg/my-lib',
    });

    expect(result.importPath).toBe('@myorg/my-lib');
  });
});
