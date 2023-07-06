import { runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('svelte e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'svelte');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  describe('Svelte lib', () => {
    it('should be able to run linter', async () => {
      const plugin = uniq('svelteliblint');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able to run check', async () => {
      const plugin = uniq('sveltelibcheck');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings, and 0 hints'
      );
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${plugin}`
      );
    });

    describe('should be able to run tests', () => {
      it('with jest', async () => {
        const plugin = uniq('jest');
        await runNxCommandAsync(
          `generate @nxext/svelte:lib ${plugin} --unitTestRunner=jest --e2eTestRunner='none'`
        );
        await runNxCommandAsync(
          `generate @nxext/svelte:component test --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(`${result.stdout}${result.stderr}`).toContain(
          'Ran all test suites'
        );
      });

      it('with vitest', async () => {
        const plugin = uniq('vitest');
        await runNxCommandAsync(
          `generate @nxext/svelte:lib ${plugin} --unitTestRunner=vitest --e2eTestRunner='none'`
        );
        await runNxCommandAsync(
          `generate @nxext/svelte:component test --project=${plugin}`
        );

        const result = await runNxCommandAsync(`test ${plugin}`);
        expect(`${result.stdout}${result.stderr}`).toContain(
          `Successfully ran target test for project ${plugin}`
        );
      });
    });

    it('should be able to run storybook', async () => {
      const plugin = uniq('sveltestories');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --unitTestRunner='none' --e2eTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:storybook-configuration ${plugin}`
      );
      await runNxCommandAsync(
        `generate @nxext/svelte:component test --project=${plugin}`
      );

      const result = await runNxCommandAsync(`build-storybook ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Storybook builder finished'
      );
    });
  });
});
