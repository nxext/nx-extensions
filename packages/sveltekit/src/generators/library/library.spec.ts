import libraryGenerator, { SvelteLibrarySchema } from './library';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { createTestProject } from '../utils/testing';

describe('library schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const libraryName = uniq('test');
  const options: SvelteLibrarySchema = {
    name: libraryName,
    project: projectName,
    unitTestRunner: 'vitest',
  };

  beforeEach(async () => {
    tree = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(libraryGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    await libraryGenerator(tree, options);
    const name = names(libraryName);
    expect(
      tree.exists(
        `apps/${projectName}/src/lib/${name.fileName}/${name.className}.svelte`
      )
    );
  });
});
