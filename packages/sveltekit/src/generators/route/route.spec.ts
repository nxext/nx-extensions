import pageGenerator, { SvelteRouteSchema } from './route';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
import { createTestProject } from '../utils/testing';

describe('page schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const pageName = uniq('home');
  const options: SvelteRouteSchema = {
    name: pageName,
    project: projectName,
    unitTestRunner: 'vitest',
  };

  beforeEach(async () => {
    tree = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(pageGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    await pageGenerator(tree, options);
    const name = names(pageName);
    expect(
      tree.exists(
        `apps/${projectName}/src/routes/${name.fileName}/${name.className}.svelte`
      )
    );
  });
});
