import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('svelte e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/svelte', 'dist/packages/svelte', [
      ['@nxext/vite', 'dist/packages/vite'],
      ['@nxext/vitest', 'dist/packages/vitest'],
    ]);
  });

  describe('Svelte lib', () => {
    it('should create svelte library', async () => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(
        `generate @nxext/svelte:lib project/uilib --e2eTestRunner='none' --junitTestRunner='none'`
      );
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    }, 120000);

    it('should be able to run linter', async () => {
      const plugin = uniq('svelteliblint');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    }, 120000);

    it('should be able to run check', async () => {
      const plugin = uniq('sveltelibcheck');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings, and 0 hints'
      );
    }, 120000);

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    }, 120000);

    it('should be able to run tests with jest', async () => {
      const plugin = uniq('sveltelibtests');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:component test --project=${plugin}`
      );

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    }, 120000);

    it('should be able to run tests with vitest', async () => {
      const plugin = uniq('sveltelibtests');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --unitTestRunner='vitest' --e2eTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:component test --project=${plugin}`
      );

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain('1 passed');
    }, 120000);
  });
});
