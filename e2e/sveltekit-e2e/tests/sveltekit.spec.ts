import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('sveltekit e2e', () => {
  it('should create sveltekit app', async () => {
    const plugin = uniq('sveltekit');
    ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
    await runNxCommandAsync(`generate @nxext/sveltekit:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('modules transformed');
    expect(result.stdout).toContain('Build executed...');
  });

  it('should create sveltekit component', async () => {
    const appName = uniq('app-sveltekit');
    const componentName = uniq('component-sveltekit');
    ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
    await runNxCommandAsync(`generate @nxext/sveltekit:app ${appName}`);
    await runNxCommandAsync(
      `generate @nxext/sveltekit:component -p ${appName} ${componentName}`
    );

    expect(() =>
      checkFilesExist(
        `apps/${appName}/src/lib/${componentName}/${componentName}.spec.ts`
      )
    ).not.toThrow();
  });

  it('should lint sveltekit app', async () => {
    const plugin = uniq('sveltekit');
    ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
    await runNxCommandAsync(`generate @nxext/sveltekit:app ${plugin}`);

    const result = await runNxCommandAsync(`lint ${plugin}`);
    expect(result.stdout).toContain('All files pass linting');
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('sveltekit');
      ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
      await runNxCommandAsync(
        `generate @nxext/sveltekit:app ${plugin} --directory subdir --linter none`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/app.html`)
      ).not.toThrow();
    });
  });

  describe('--tags', () => {
    it('should add tags to project', async () => {
      const plugin = uniq('sveltekit');
      ensureNxProject('@nxext/sveltekit', 'dist/packages/sveltekit');
      await runNxCommandAsync(
        `generate @nxext/sveltekit:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });
  });
});
