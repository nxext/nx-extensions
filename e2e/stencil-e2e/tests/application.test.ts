import { ProjectType } from '@nrwl/workspace';
import {
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';

describe('e2e', () => {
  describe('generate with style', () => {
    describe('stencil app', () => {
      it(`should create app`, async (done) => {
        const plugin = uniq('app2');

        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:app ${plugin} --style='css'`
        );

        testProject(plugin, 'css', ProjectType.Application);

        done();
      });
    });

    describe('--directory', () => {
      it('should create src in the specified directory', async (done) => {
        const plugin = uniq('app1');
        const style = 'css';
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:application ${plugin} --directory subdir --style=${style}`
        );

        testProject(plugin, style, ProjectType.Application, 'subdir');
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
      it(`should build app with scss`, async (done) => {
        const plugin = uniq('app2');
        ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:app ${plugin} --style='scss'`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');

        done();
      });
    });
  });
});
