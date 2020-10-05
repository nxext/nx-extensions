import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { normalize } from '@angular-devkit/core';

describe('e2e', () => {
  describe('generate with style', () => {
    describe('--tags', () => {
      it('should add tags to nx.json', async (done) => {
        const plugin = uniq('app3');
        ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
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
        ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
        await runNxCommandAsync(
          `generate @nxext/stencil:app ${plugin} --style='scss'`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');
        expect(() => {
          checkFilesExist(
            normalize(`dist/apps/${plugin}/www/index.html`),
            normalize(`dist/apps/${plugin}/www/host.config.json`)
          );
        }).not.toThrow();

        done();
      });
    });
  });
});
