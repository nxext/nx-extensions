import componentGenerator, { SvelteComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { ProjectType } from '@nrwl/workspace';
import { uniq } from '@nrwl/nx-plugin/testing';
import { names, Tree } from '@nrwl/devkit';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const componentName = uniq('test');
  const options: SvelteComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
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
        `apps/${projectName}/src/components/${name.fileName}/${name.className}.svelte`
      )
    );
  });

  it('should add file to barrel', async () => {
    const tree = await createTestProject(projectName, ProjectType.Library);
    await componentGenerator(tree, options);
    const name = names(componentName);

    const indexFile = tree.read(`libs/${projectName}/src/index.ts`);
    expect(indexFile.toString('utf-8')).toMatch(
      `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.svelte';`
    );
  });
});
