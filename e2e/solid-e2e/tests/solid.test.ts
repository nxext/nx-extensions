import { checkFilesExist, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('solid e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'solid');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
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
