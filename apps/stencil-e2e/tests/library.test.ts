import { ProjectType, projectRootDir } from '@nrwl/workspace';
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
    describe('stencil lib', () => {
      for (var style of ['css', 'scss', 'less', 'styl', 'pcss']) {
        it(`should create lib with ${style}`, async (done) => {
          const plugin = uniq('lib');

          ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
          await runNxCommandAsync(
            `generate @nxext/stencil:lib ${plugin} --style=${style}`
          );

          testProject(plugin, style, ProjectType.Library);

          done();
        });
      }
    });

    describe('--directory', () => {
      it('should create src in the specified directory', async (done) => {
        const plugin = uniq('lib');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --directory subdir --style=css`
        );
        expect(() =>
          checkFilesExist(`libs/subdir/${plugin}/stencil.config.ts`)
        ).not.toThrow();
        done();
      });
    });

    describe('--tags', () => {
      it('should add tags to nx.json', async (done) => {
        const plugin = uniq('lib');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --tags e2etag,e2ePackage --style=css`
        );
        const nxJson = readJson('nx.json');
        expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
        done();
      });
    });

    describe('stencil lib builder', () => {
      SUPPORTED_STYLE_LIBRARIES.forEach(style => {
        it(`should build app with ${style}`, async (done) => {
          const plugin = uniq('lib');
          ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
          await runNxCommandAsync(
            `generate @nxext/stencil:lib ${plugin} --style=css`
          );

          const result = await runNxCommandAsync(`build ${plugin}`);
          expect(result.stdout).toContain('build finished');

          done();
        });
      });
    });
  });
});
