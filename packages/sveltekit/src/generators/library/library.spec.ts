import { libraryGenerator, SvelteLibrarySchema } from './library';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { createTsSolutionTree } from '@nxext/common';
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
    expect(tree.exists(`${projectName}/src/${name.fileName}.ts`)).toBeTruthy();
  });

  describe('TS-solution mode', () => {
    // The host project is package.json-backed here: no project.json, no
    // explicit sourceRoot - the generator has to fall back to `<root>/src`
    // via getProjectSourceRoot instead of reading projectConfig.sourceRoot.
    beforeEach(async () => {
      tree = await createTestProject(projectName, 'none', createTsSolutionTree());
    });

    it('should run successfully', async () => {
      await expect(libraryGenerator(tree, options)).resolves.not.toThrowError();
    });

    it('should add file under the package.json-backed project source root', async () => {
      await libraryGenerator(tree, options);
      const name = names(libraryName);
      expect(tree.exists(`${projectName}/project.json`)).toBeFalsy();
      expect(
        tree.exists(`${projectName}/src/${name.fileName}.ts`)
      ).toBeTruthy();
    });
  });
});
