import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../utils/testing';
import { logger } from '@nrwl/devkit';

describe('svelte e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/svelte', 'dist/packages/svelte', [
      ['@nxext/vite', 'dist/packages/vite'],
    ]);
  });

  describe('Svelte app', () => {
    it('should build svelte application', async () => {
      const plugin = uniq('svelte');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('sveltetags');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(`generate @nxext/svelte:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('sveltelint');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able to run check', async () => {
      const plugin = uniq('svelteappcheck');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings and 0 hints'
      );
    });

    it('should be able to run tests', async () => {
      const plugin = uniq('svelteapptests');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);
      await runNxCommandAsync(`generate @nxext/svelte:component test --project=${plugin}`);

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    });
  });

  describe('Svelte lib', () => {
    it('should create svelte library', async () => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(`generate @nxext/svelte:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('svelteliblint');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able to run check', async () => {
      const plugin = uniq('sveltelibcheck');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings and 0 hints'
      );
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --buildable`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });

    it('should be able to run tests', async () => {
      const plugin = uniq('sveltelibtests');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);
      await runNxCommandAsync(`generate @nxext/svelte:component test --project=${plugin}`);

      const result = await runNxCommandAsync(`test ${plugin}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    });
  });
});
