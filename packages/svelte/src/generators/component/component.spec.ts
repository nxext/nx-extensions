import componentGenerator, { SvelteComponentSchema } from './component';
import { createTestProject } from '../utils/testing';
import { uniq } from '@nx/plugin/testing';
import { logger, names, Tree } from '@nx/devkit';

describe('component generator', () => {
  let tree: Tree;
  const projectName = uniq('testprojekt');
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
      await expect(
        componentGenerator(tree, options)
      ).resolves.not.toThrowError();
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
      const tree = await createTestProject(projectName, 'library');
      await componentGenerator(tree, options);
      const name = names(componentName);

      const indexFile = tree.read(`libs/${projectName}/src/index.ts`);
      expect(indexFile.toString('utf-8')).toMatch(
        `export { default as ${name.className} } from './components/${name.fileName}/${name.className}.svelte';`
      );
    });
  });

  describe('library', () => {
    beforeEach(async () => {
      tree = await createTestProject(projectName, 'library');
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'warn').mockImplementation(() => {});
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jest.spyOn(logger, 'debug').mockImplementation(() => {});
    });

    it('should add stories file if storybook is configured', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);
      tree.write(`libs/${projectName}/.storybook/main.js`, '');

      expect(
        tree.exists(
          `libs/${projectName}/src/components/${name.fileName}/${name.fileName}.stories.ts`
        )
      );
    });

    it('should remove stories file if storybook is not configured', async () => {
      await componentGenerator(tree, options);
      const name = names(componentName);

      expect(
        tree.exists(
          `libs/${projectName}/src/components/${name.fileName}/${name.fileName}.stories.ts`
        )
      ).toBeFalsy();
    });
  });
});
