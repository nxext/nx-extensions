import { projectRootDir, ProjectType } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';

describe('e2e-pwa', () => {
  describe('stencil pwa', () => {
    it(`should create pwa with css`, async (done) => {
      const plugin = uniq('pwa');

      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:pwa ${plugin} --style='css'`
      );

      testProject(plugin, 'css', ProjectType.Application);

      done();
    });
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('pwa');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:pwa ${plugin} --directory subdir --style=css`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/stencil.config.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('pwa');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:pwa ${plugin} --tags e2etag,e2ePackage --style=css`
      );

      expect(() => {
        checkFilesExist(
          `apps/${plugin}/src/components/app-root/app-root.e2e.ts`,
          `apps/${plugin}/src/components/app-profile/app-profile.e2e.ts`,
          `apps/${plugin}/src/components/app-home/app-home.e2e.ts`
        );
      }).not.toThrow();

      done();
    });
  });

  describe('stencil app builder', () => {
    it(`should bould pwa app with scss`, async (done) => {
      const plugin = uniq('pwa');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:pwa ${plugin} --style='scss'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });
  });
});
