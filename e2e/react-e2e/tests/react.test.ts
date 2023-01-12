import {
  checkFilesExist,
  cleanup,
  readJson,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';

describe('react e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/react']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  describe('react app', () => {
    it('should build react application', async () => {
      const plugin = uniq('react');
      await runNxCommandAsync(`generate @nxext/react:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('reacttags');
      await runNxCommandAsync(
        `generate @nxext/react:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(`generate @nxext/react:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.tsx`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('reactlint');
      await runNxCommandAsync(`generate @nxext/react:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('react lib', () => {
    it('should create react library', async () => {
      const plugin = uniq('reactlib');
      await runNxCommandAsync(`generate @nxext/react:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(`generate @nxext/react:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('reactliblint');
      await runNxCommandAsync(`generate @nxext/react:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('reactlib');
      await runNxCommandAsync(
        `generate @nxext/react:lib ${plugin} --buildable`
      );

      await runNxCommandAsync(`build ${plugin}`);

      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });
  });
});
