import componentGenerator, { SolidComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { uniq } from '@nrwl/nx-plugin/testing';
import { names, Tree } from '@nrwl/devkit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nrwl/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../init/lib/util');

describe('component schematic', () => {
  let host: Tree;
  const projectName = uniq('testprojekt');
  const componentName = uniq('test');
  const options: SolidComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
  };

  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

  beforeEach(async () => {
    host = await createTestProject(projectName);
  });

  it('should run successfully', async () => {
    await expect(componentGenerator(host, options)).resolves.not.toThrowError();
  });

  it('should add file', async () => {
    await componentGenerator(host, options);
    const name = names(componentName);
    expect(
      host.exists(
        `apps/${projectName}/src/components/${name.fileName}/${name.className}.ts`
      )
    );
  });

  it('should add file to barrel', async () => {
    const tree = await createTestProject(projectName, 'library');
    await componentGenerator(tree, options);
    const name = names(componentName);

    const indexFile = tree.read(`libs/${projectName}/src/index.ts`);
    expect(indexFile.toString('utf-8')).toMatch(
      `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.ts';`
    );
  });
});
