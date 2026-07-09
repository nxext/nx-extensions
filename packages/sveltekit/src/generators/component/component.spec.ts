import { componentGenerator, SvelteComponentSchema } from './component';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { createTsSolutionTree } from '@nxext/common';
import { createTestProject } from '../utils/testing';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const componentName = uniq('test');
  const options: SvelteComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'vitest',
  };

  beforeEach(async () => {
    tree = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(componentGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    await componentGenerator(tree, options);
    const name = names(componentName);
    expect(
      tree.exists(
        `${projectName}/src/lib/${name.fileName}/${name.className}.svelte`,
      ),
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
      await expect(
        componentGenerator(tree, options),
      ).resolves.not.toThrowError();
    });

    it('should add file under the package.json-backed project source root', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);
      expect(tree.exists(`${projectName}/project.json`)).toBeFalsy();
      expect(
        tree.exists(
          `${projectName}/src/lib/${name.fileName}/${name.className}.svelte`,
        ),
      ).toBeTruthy();
    });
  });
});
