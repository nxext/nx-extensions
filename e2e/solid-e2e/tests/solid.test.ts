import {
  checkFilesExist,
  cleanup,
  readJson,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';
import { newProject } from '../../e2e/src';

describe('solid e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/solid']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  describe('solid app', () => {
    it('should build solid application', async () => {
      const plugin = uniq('solid');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${plugin}`
      );
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('solidlint');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('solid lib', () => {
    it('should generate lib into directory', async () => {
      await runNxCommandAsync(
        `generate @nxext/solid:lib project/uilib --e2eTestRunner='none' --junitTestRunner='none'`
      );
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('solidliblint');
      await runNxCommandAsync(
        `generate @nxext/solid:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('solidlib');
      await runNxCommandAsync(
        `generate @nxext/solid:lib ${plugin} --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${plugin}`
      );
    });
  });
});
