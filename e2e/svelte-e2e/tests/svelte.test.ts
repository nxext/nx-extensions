import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq
} from '@nrwl/nx-plugin/testing';

describe('svelte e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxext/svelte', 'dist/packages/svelte');
  });

  it('should create svelte application', async (done) => {
    const plugin = uniq('svelte');
    await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Bundle complete');

    expect(() =>
      checkFilesExist(`dist/apps/${plugin}/index.html`)
    ).not.toThrow();

    done();
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('sveltetags');
      await runNxCommandAsync(
        `generate @nxext/svelte:app ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });

  describe('directory', () => {
    it('should generate app into directory', async (done) => {
      await runNxCommandAsync(
        `generate @nxext/svelte:app project/ui`
      );
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();

      done();
    });
  });

  describe('linting', () => {
    it('should be able to run linter', async (done) => {
      const plugin = uniq('sveltelint');
      await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');

      done();
    });
  });
});
