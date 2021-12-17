import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('angular e2e', () => {
  it('should create angular', async () => {
    const plugin = uniq('angular');
    ensureNxProject('@nxext/angular', 'dist/packages/angular');
    await runNxCommandAsync(`generate @nxext/angular:angular ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('angular');
      ensureNxProject('@nxext/angular', 'dist/packages/angular');
      await runNxCommandAsync(
        `generate @nxext/angular:angular ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('angular');
      ensureNxProject('@nxext/angular', 'dist/packages/angular');
      await runNxCommandAsync(
        `generate @nxext/angular:angular ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
