import { ProjectType } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';
import { SUPPORTED_STYLE_LIBRARIES } from '../../../libs/stencil/src/utils/testing';

describe('e2e-pwa', () => {
  describe('stencil pwa', () => {
    for (var style of ['css', 'scss', 'less', 'styl', 'pcss']) {
      xit(`should create pwa with ${style}`, async (done) => {
        const plugin = uniq('pwa');

        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:pwa ${plugin} --style=${style}`
        );

        testProject(plugin, style, ProjectType.Application);

        done();
      });
    }

    describe('--directory', () => {
      it('should create src in the specified directory', async (done) => {
        const plugin = uniq('pwa');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
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
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:pwa ${plugin} --tags e2etag,e2ePackage --style=css`
        );

        done();
      });
    });

    describe('stencil app builder', () => {
      SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
        it(`should bould pwa app with ${style}`, async (done) => {
          const plugin = uniq('pwa');
          ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
          await runNxCommandAsync(
            `generate @nxext/stencil:pwa ${plugin} --style=${style}`
          );

          const result = await runNxCommandAsync(`build ${plugin} --dev`);
          expect(result.stdout).toContain('build finished');

          done();
        });
      });
    });
  });
});
