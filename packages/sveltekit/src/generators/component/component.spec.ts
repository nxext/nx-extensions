import componentGenerator, { SvelteComponentSchema } from './component';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';
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
        `apps/${projectName}/src/lib/${name.fileName}/${name.className}.svelte`
      )
    );
  });
});
