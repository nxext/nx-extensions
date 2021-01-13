import { Tree } from '@angular-devkit/schematics';
import { ComponentSchema } from './component';
import { createTestProject, runSchematic } from '../utils/testing';

describe('component schematic', () => {
  let appTree: Tree;
  const projectName = 'testprojekt';
  const options: ComponentSchema = {
    name: 'test',
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

    expect(result.exists(`apps/${projectName}/src/components/test/Test.svelte`));
  });
});
