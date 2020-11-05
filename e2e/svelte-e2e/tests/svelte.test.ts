import {
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('svelte e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxext/svelte', 'dist/packages/svelte');
  })

  xit('should create svelte application', async (done) => {
    const plugin = uniq('svelte');
    await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Bundle complete');

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
