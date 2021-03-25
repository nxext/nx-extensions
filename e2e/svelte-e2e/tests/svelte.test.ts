import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../tailwind-e2e/utils/testing';

describe('svelte e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/svelte', 'dist/packages/svelte', [
      ['@nxext/vite', 'dist/packages/vite'],
    ]);
  });

  describe('Svelte app', () => {
    it('should build svelte application', async (done) => {
      const plugin = uniq('svelte');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();

      done();
    });

    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('sveltetags');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });

    it('should generate app into directory', async (done) => {
      await runNxCommandAsync(`generate @nxext/svelte:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();

      done();
    });

    it('should be able to run linter', async (done) => {
      const plugin = uniq('sveltelint');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');

      done();
    });

    it('should be able to run check', async (done) => {
      const plugin = uniq('svelteappcheck');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings and 0 hints'
      );

      done();
    });
  });

  describe('Svelte lib', () => {
    it('should create svelte library', async (done) => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();

      done();
    });

    it('should generate lib into directory', async (done) => {
      await runNxCommandAsync(`generate @nxext/svelte:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();

      done();
    });

    it('should be able to run linter', async (done) => {
      const plugin = uniq('svelteliblint');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');

      done();
    });

    it('should be able to run check', async (done) => {
      const plugin = uniq('sveltelibcheck');
      await runNxCommandAsync(`generate @nxext/svelte:lib ${plugin}`);

      const result = await runNxCommandAsync(`check ${plugin}`);
      expect(result.stdout).toContain(
        'svelte-check found 0 errors, 0 warnings and 0 hints'
      );

      done();
    });

    it('should be able build lib if buildable', async (done) => {
      const plugin = uniq('sveltelib');
      await runNxCommandAsync(
        `generate @nxext/svelte:lib ${plugin} --buildable`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/libs/${plugin}/bundle.js`)
      ).not.toThrow();

      done();
    });
  });

  describe('Svelte vite app', () => {
    it('should build svelte application', async (done) => {
      const plugin = uniq('svelte');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin} --bundler=vite`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();

      done();
    });

    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('sveltetags');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --tags e2etag,e2ePackage --bundler=vite`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });

    it('should generate app into directory', async (done) => {
      await runNxCommandAsync(`generate @nxext/svelte:app project/uivite --bundler=vite`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();

      done();
    });

    it('should be able to run linter', async (done) => {
      const plugin = uniq('sveltelint');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin} --bundler=vite`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');

      done();
    });

    it('should add a experimental note', async (done) => {
      const plugin = uniq('sveltenote');
      const result = await runNxCommandAsync(`generate @nxext/svelte:app ${plugin} --bundler=vite`);

      expect(result.stdout).toContain('The Vite feature is experimental, be aware!!');

      done();
    });
  });
});
