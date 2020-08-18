import { projectRootDir, ProjectType } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';

describe('e2e-pwa', () => {
  describe('stencil ionic app', () => {
    it(`should create ionic app with css`, async (done) => {
      const plugin = uniq('ionic-app');

      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='css'`
      );

      testProject(plugin, 'css', ProjectType.Application);

      done();
    });
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('ionic-app');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --directory subdir --style=css`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/stencil.config.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('stencil ionic app builder', () => {
    it(`should build ionic app app with scss`, async (done) => {
      const plugin = uniq('ionic-app');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='scss'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });

    it('should add capacitor project', async (done) => {
      const plugin = uniq('ionic-app');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --tags e2etag,e2ePackage --style=css`
      );

      expect(() => {
        checkFilesExist(
          `apps/${plugin}/src/components/app-root/app-root.tsx`,
          `apps/${plugin}/src/components/app-profile/app-profile.tsx`,
          `apps/${plugin}/src/components/app-home/app-home.tsx`,
          `apps/${plugin}/src/components/app-tabs/app-tabs.tsx`,

          `apps/${plugin}-cap/capacitor.config.json`
        );
      }).not.toThrow();

      done();
    });
  });
});
