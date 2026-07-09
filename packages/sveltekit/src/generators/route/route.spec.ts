import { routeGenerator, SvelteRouteSchema } from './route';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { createTsSolutionTree } from '@nxext/common';
import { createTestProject } from '../utils/testing';

describe('page schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const pageName = uniq('home');
  const options: SvelteRouteSchema = {
    name: pageName,
    project: projectName,
    unitTestRunner: 'vitest',
    error: true,
  };

  beforeEach(async () => {
    tree = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(routeGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    await routeGenerator(tree, options);
    const name = names(pageName);
    expect(
      tree.exists(`${projectName}/src/routes/${name.fileName}/+error.svelte`),
    ).toBeTruthy();
  });

  describe('TS-solution mode', () => {
    // The host project is package.json-backed here: no project.json, no
    // explicit sourceRoot - the generator has to fall back to `<root>/src`
    // via getProjectSourceRoot instead of reading projectConfig.sourceRoot.
    beforeEach(async () => {
      tree = await createTestProject(
        projectName,
        'none',
        createTsSolutionTree(),
      );
    });

    it('should run successfully', async () => {
      await expect(routeGenerator(tree, options)).resolves.not.toThrowError();
    });

    it('should add file under the package.json-backed project source root', async () => {
      await routeGenerator(tree, options);
      const name = names(pageName);
      expect(tree.exists(`${projectName}/project.json`)).toBeFalsy();
      expect(
        tree.exists(`${projectName}/src/routes/${name.fileName}/+error.svelte`),
      ).toBeTruthy();
    });
  });
});
