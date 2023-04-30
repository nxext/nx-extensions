import componentGenerator, { PreactComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { ProjectType } from '@nx/workspace';
import { uniq } from '@nx/plugin/testing';
import { names, Tree } from '@nx/devkit';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../utils/utils');

describe('component schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('16.0.0');

  let tree: Tree;
  const projectName = uniq('testprojekt');
  const componentName = uniq('test');
  const options: PreactComponentSchema = {
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
        `apps/${projectName}/src/components/${name.fileName}/${name.className}.ts`
      )
    );
  });

  it('should add file to barrel', async () => {
    const tree = await createTestProject(projectName, ProjectType.Library);
    await componentGenerator(tree, options);
    const name = names(componentName);

    const indexFile = tree.read(`libs/${projectName}/src/index.ts`);
    expect(indexFile.toString('utf-8')).toMatch(
      `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.ts';`
    );
  });
});
