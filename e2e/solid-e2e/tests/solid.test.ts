import {
  checkFilesExist,
  cleanup,
  readJson,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('solid e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/solid']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    //cleanup();
  });

  describe('solid app', () => {
    it('should build solid application', async () => {
      const plugin = uniq('solid');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain(
        'Successfully ran target build for project'
      );

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

    it('should be able to run linter', async () => {
      const plugin = uniq('solidlint');
      await runNxCommandAsync(
        `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    describe('should be able to test the application', () => {
      xit('with jest', async () => {
        const plugin = uniq('solidjest');
        await runNxCommandAsync(
          `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='jest'`
        );
        await runNxCommandAsync(
          `generate @nxext/solid:component testcomp --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(result.stdout).toContain(
          'Successfully ran target build for project'
        );
      });

      it('with vitest', async () => {
        const plugin = uniq('solidvitest');
        await runNxCommandAsync(
          `generate @nxext/solid:app ${plugin} --e2eTestRunner='none' --junitTestRunner='vitest'`
        );
        await runNxCommandAsync(
          `generate @nxext/solid:component testcomp --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(result.stdout).toContain(
          'Successfully ran target build for project'
        );
      });
    });
  });

  xdescribe('solid lib', () => {
    it('should create solid library', async () => {
      const plugin = uniq('solidlib');
      await runNxCommandAsync(
        `generate @nxext/solid:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
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
          `dist/libs/${plugin}/index.js`,
          `dist/libs/${plugin}/index.mjs`
        )
      ).not.toThrow();
    });

    describe('should be able to test the library', () => {
      xit('with jest', async () => {
        const plugin = uniq('solidjest');
        await runNxCommandAsync(
          `generate @nxext/solid:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='jest'`
        );
        await runNxCommandAsync(
          `generate @nxext/solid:component testcomp --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(result.stdout).toContain(
          'Successfully ran target build for project'
        );
      });

      xit('with vitest', async () => {
        const plugin = uniq('solidvitest');
        await runNxCommandAsync(
          `generate @nxext/solid:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='vitest'`
        );
        await runNxCommandAsync(
          `generate @nxext/solid:component testcomp --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(result.stdout).toContain(
          'Successfully ran target build for project'
        );
      });
    });
  });
});
