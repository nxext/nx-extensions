/**
 * Reference real-install e2e for @nxext/solid. See stencil-e2e for flow overview.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  runNxCommandAsync,
  stripAnsi,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/solid', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'solid');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  describe('application', () => {
    it('builds a solid app', async () => {
      const app = uniq('solid-app');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/solid:app apps/${app} --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
      expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
        `Successfully ran target build for project ${app}`
      );
    });

    it('lints a solid app', async () => {
      const app = uniq('solid-app-lint');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/solid:app apps/${app} --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `lint ${app}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('library', () => {
    it('generates a lib into a nested directory', async () => {
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/solid:lib libs/project/uilib --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );
      expect(() =>
        checkFilesExist(projectDirectory, `libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('lints a solid lib', async () => {
      const lib = uniq('solid-lib-lint');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/solid:lib libs/${lib} --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `lint ${lib}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('builds a buildable solid lib', async () => {
      const lib = uniq('solid-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/solid:lib libs/${lib} --buildable --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `build ${lib}`);
      expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
        `Successfully ran target build for project ${lib}`
      );
    });
  });
});
