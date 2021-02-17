import { Tree } from '@angular-devkit/schematics';
import { SvelteComponentSchema } from './component';
import { createTestProject, runSchematic } from '../utils/testing';
import { ProjectType } from '@nrwl/workspace';
import { uniq } from '@nrwl/nx-plugin/testing';
import { names } from '@nrwl/devkit';

describe('component schematic', () => {
  let appTree: Tree;
  const projectName = uniq('testprojekt');
  const componentName = uniq('test');
  const options: SvelteComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
  };

  beforeEach(async () => {
    appTree = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(
      runSchematic('component', options, appTree)
    ).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    const result = await runSchematic('component', options, appTree);
    const name = names(componentName);
    expect(result.exists(`apps/${projectName}/src/components/${name.fileName}/${name.className}.svelte`));
  });

  it('should add file to barrel', async () => {
    const tree = await createTestProject(projectName, ProjectType.Library);
    const result = await runSchematic('component', options, tree);
    const name = names(componentName);

    const indexFile = result.readContent(`libs/${projectName}/src/index.ts`)
    expect(indexFile).toMatch(`export { default as default } from './components/${name.fileName}/${name.className}.svelte';`);
  });
});
