import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('preact e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/preact']);
  });

  describe('preact app', () => {
    it('should build preact application', async () => {
      const plugin = uniq('preact');
      await runNxCommandAsync(`generate @nxext/preact:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('preacttags');
      await runNxCommandAsync(
        `generate @nxext/preact:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(`generate @nxext/preact:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/App.tsx`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('preactlint');
      await runNxCommandAsync(`generate @nxext/preact:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('preact lib', () => {
    it('should create preact library', async () => {
      const plugin = uniq('preactlib');
      await runNxCommandAsync(`generate @nxext/preact:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(`generate @nxext/preact:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('preactliblint');
      await runNxCommandAsync(`generate @nxext/preact:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('preactlib');
      await runNxCommandAsync(
        `generate @nxext/preact:lib ${plugin} --buildable`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });
  });
});
