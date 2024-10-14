import { componentGenerator, SolidComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';

describe('component schematic', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const componentName = uniq('test');
  const options: SolidComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
  };

  it('should run successfully', async () => {
    tree = await createTestProject(projectAppDirectory);
    await expect(componentGenerator(tree, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    tree = await createTestProject(projectAppDirectory);
    await componentGenerator(tree, options);
    const name = names(componentName);
    expect(
      tree.exists(
        `${projectAppDirectory}/src/components/${name.fileName}/${name.className}.ts`
      )
    );
  });

  it('should add file to barrel', async () => {
    tree = await createTestProject(projectLibDirectory, 'library');
    await componentGenerator(tree, options);
    const name = names(componentName);

    const indexFile = tree.read(`${projectLibDirectory}/src/index.ts`);
    expect(indexFile.toString('utf-8')).toMatch(
      `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.ts';`
    );
  });
});
