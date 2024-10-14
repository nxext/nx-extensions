import { componentGenerator, SvelteComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { logger, names, Tree } from '@nx/devkit';

describe('component generator', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
  const projectAppDirectory = `apps/${projectName}`;
  const projectLibDirectory = `libs/${projectName}`;
  const componentName = uniq('test');
  const options: SvelteComponentSchema = {
    name: componentName,
    project: projectName,
    unitTestRunner: 'jest',
  };

  describe('application', () => {
    beforeEach(async () => {
      tree = await createTestProject(projectName);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'warn').mockImplementation(() => {});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'debug').mockImplementation(() => {});
    });

    it('should run successfully', async () => {
      await expect(componentGenerator(tree, options)).resolves.not.toThrow();
    });

    it('should add file', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);
      expect(
        tree.exists(
          `${projectAppDirectory}/src/components/${name.fileName}/${name.className}.svelte`
        )
      );
    });
  });

  describe('library', () => {
    beforeEach(async () => {
      tree = await createTestProject(projectLibDirectory, 'library');
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'warn').mockImplementation(() => {});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'debug').mockImplementation(() => {});
    });

    it('should add file to barrel', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);

      const indexFile = tree.read(`${projectLibDirectory}/src/index.ts`);
      expect(indexFile.toString('utf-8')).toMatch(
        `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.svelte';`
      );
    });

    it('should add stories file if storybook is configured', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);
      tree.write(`${projectLibDirectory}/.storybook/main.js`, '');

      expect(
        tree.exists(
          `${projectLibDirectory}/src/components/${name.fileName}/${name.fileName}.stories.ts`
        )
      );
    });

    it('should remove stories file if storybook is not configured', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);

      expect(
        tree.exists(
          `${projectLibDirectory}/src/components/${name.fileName}/${name.fileName}.stories.ts`
        )
      ).toBeFalsy();
    });
  });
});
