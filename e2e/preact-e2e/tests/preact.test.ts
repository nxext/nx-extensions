import {
  checkFilesExist,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';
import { newProject } from '../../e2e/src';

xdescribe('preact e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/preact']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
  });

  describe('preact app', () => {
    it('should build preact application', async () => {
      const plugin = uniq('preact');
      await runNxCommandAsync(`generate @nxext/preact:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${plugin}`
      );
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
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${plugin}`
      );
    });
  });
});
