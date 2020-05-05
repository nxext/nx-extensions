import { ProjectType } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { SUPPORTED_STYLE_LIBRARIES } from '../../../libs/stencil/src/utils/testing';
import { testProject } from '../utils/testing';

describe('e2e', () => {
  describe('generate with style', () => {
    describe('stencil app', () => {
      for (var style of ['css', 'scss', 'less', 'styl', 'pcss']) {
        it(`should create app with ${style}`, async (done) => {
          const plugin = uniq('app2');

          ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
          await runNxCommandAsync(
            `generate @nxext/stencil:app ${plugin} --style=${style}`
          );

          testProject(plugin, style, ProjectType.Application);

          done();
        });
      }
    });

    describe('--directory', () => {
      it('should create src in the specified directory', async (done) => {
        const plugin = uniq('app1');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:application ${plugin} --directory subdir --style=css`
        );
        expect(() =>
          checkFilesExist(`apps/subdir/${plugin}/stencil.config.ts`)
        ).not.toThrow();
        done();
      });
    });

    describe('--tags', () => {
      it('should add tags to nx.json', async (done) => {
        const plugin = uniq('app3');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:app ${plugin} --tags e2etag,e2ePackage --style=css`
        );
        const nxJson = readJson('nx.json');
        expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
        done();
      });
    });

    describe('stencil app builder', () => {
      SUPPORTED_STYLE_LIBRARIES.forEach((style) => {
        it(`should build app with ${style}`, async (done) => {
          const plugin = uniq('app2');
          ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
          await runNxCommandAsync(
            `generate @nxext/stencil:app ${plugin} --style=${style}`
          );

          const result = await runNxCommandAsync(`build ${plugin} --dev`);
          expect(result.stdout).toContain('build finished');

          done();
        });
      });
    });
  });
});
