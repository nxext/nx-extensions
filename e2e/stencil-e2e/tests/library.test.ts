import { ProjectType, projectRootDir } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';

describe('e2e', () => {
  describe('generate', () => {
    describe('stencil lib', () => {
      it(`should create lib with css`, async (done) => {
        const plugin = uniq('lib');

        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css'`
        );

        testProject(plugin, 'css', ProjectType.Library);

        done();
      });
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
      it(`should build app with scss`, async (done) => {
        const plugin = uniq('lib');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='scss'`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');

        done();
      });
    });
  });
});
