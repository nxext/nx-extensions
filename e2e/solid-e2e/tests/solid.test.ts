import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../utils/testing';

describe('solid e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/solid', 'dist/packages/solid', [
      ['@nxext/vite', 'dist/packages/vite'],
    ]);
  });

  describe('solid app', () => {
    it('should build solid application', async () => {
      const plugin = uniq('solid');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('solidtags');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --tags e2etag,e2ePackage --e2eTestRunner='none' --junitTestRunner='none'`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(
        `generate @nxext/solid:app project/ui --e2eTestRunner='none' --junitTestRunner='none'`
      );
      expect(() =>
        checkFilesExist(`apps/project/ui/src/App.tsx`)
      ).not.toThrow();
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
    it('should create solid library', async () => {
      const plugin = uniq('solidlib');
      await runNxCommandAsync(
        `generate @nxext/solid:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

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
      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });
  });
});
