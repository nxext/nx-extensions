/**
 * Reference real-install e2e for @nxext/preact. See stencil-e2e for flow overview.
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

describe('@nxext/preact', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'preact');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  describe('application', () => {
    it('generates an app into a nested directory', async () => {
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/preact:app apps/project/ui --no-interactive`
      );
      expect(() =>
        checkFilesExist(projectDirectory, `apps/project/ui/src/App.tsx`)
      ).not.toThrow();
    });

    it('lints a preact app', async () => {
      const app = uniq('preact-app-lint');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/preact:app apps/${app} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `lint ${app}`);
      expect(result.stdout).toContain('All files pass linting');
    });
  });

  describe('library', () => {
    it('generates a lib into a nested directory', async () => {
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/preact:lib libs/project/uilib --no-interactive`
      );
      expect(() =>
        checkFilesExist(projectDirectory, `libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('lints a preact lib', async () => {
      const lib = uniq('preact-lib-lint');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/preact:lib libs/${lib} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `lint ${lib}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('builds a buildable preact lib', async () => {
      const lib = uniq('preact-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/preact:lib libs/${lib} --buildable --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `build ${lib}`);
      expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
        `Successfully ran target build for project ${lib}`
      );
    });
  });
});
