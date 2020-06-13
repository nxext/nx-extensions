import {
  checkFilesExist,
  ensureNxProject,
  renameFile,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('e2e', () => {
  describe('stencil builder', () => {
    it(`should build with custom stencil config naming`, async (done) => {
      const plugin = uniq('library');
      ensureNxProject('@nxext/stencil', 'dist/libs/stencil');

      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss`
      );

      const uniqConfigFilename = uniq('stencil.config');
      renameFile(
        `libs/${plugin}/stencil.config.ts`,
        `libs/${plugin}/${uniqConfigFilename}.ts`
      );

      const result = await runNxCommandAsync(
        `build ${plugin} --configPath=libs/${plugin}/${uniqConfigFilename}.ts`
      );
      expect(result.stdout).toContain('build finished');

      done();
    });

    it(`should build with custom configPath`, async (done) => {
      const plugin = uniq('library');
      ensureNxProject('@nxext/stencil', 'dist/libs/stencil');

      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss`
      );

      const result = await runNxCommandAsync(
        `build ${plugin} --configPath=libs/${plugin}/stencil.config.ts`
      );
      expect(result.stdout).toContain('build finished');

      done();
    });

    it('should build with --directory', async (done) => {
      const plugin = uniq('app');
      ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:application ${plugin} --directory subdir --style=css`
      );

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('build finished');
      done();
    });
  });
});
