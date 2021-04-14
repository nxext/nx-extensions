import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  renameFile,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { normalize } from '@angular-devkit/core';

describe('e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
  });

  describe('library', () => {
    describe('outputtarget', () => {
      it(`should generate react lib`, async (done) => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css' --buildable`
        );
        await runNxCommandAsync(
          `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=react`
        );

        expect(() =>
          checkFilesExist(`libs/${plugin}-react/src/index.ts`)
        ).not.toThrow();

        done();
      });

      it(`should generate angular lib`, async (done) => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css' --buildable`
        );
        await runNxCommandAsync(
          `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=angular`
        );
        await runNxCommandAsync(`build ${plugin}`);

        expect(() =>
          checkFilesExist(
            `libs/${plugin}-angular/src/index.ts`,
            `libs/${plugin}-angular/src/lib/${plugin}-angular.module.ts`,
            `libs/${plugin}-angular/src/generated/directives/proxies.ts`
          )
        ).not.toThrow();

        expect(() =>
          checkFilesExist(
            `libs/${plugin}-angular/src/index.ts`,
            `libs/${plugin}-angular/src/lib/${plugin}-angular.module.ts`
          )
        ).not.toThrow();

        done();
      });

      it(`should stop if lib not buildable`, async (done) => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css'`
        );
        const result = await runNxCommandAsync(
          `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=angular`
        );

        expect(result.stdout).toContain(
          'Please use a buildable library for custom outputtargets'
        );

        done();
      });
    });

    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --directory subdir --style=css --buildable`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${plugin}/stencil.config.ts`)
      ).not.toThrow();
      done();
    });

    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --tags e2etag,e2ePackage --style=css`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });

    it(`should build app with scss`, async (done) => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='scss' --buildable`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });

    it('should be able to make a lib buildable', async (done) => {
      const plugin = uniq('lib');
      await runNxCommandAsync(`generate @nxext/stencil:lib ${plugin}`);
      await runNxCommandAsync(
        `generate @nxext/stencil:make-lib-buildable ${plugin} --importPath=@my/lib`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      expect(() =>
        checkFilesExist(`libs/${plugin}/stencil.config.ts`)
      ).not.toThrow();

      done();
    });
  });

  describe('e2e-pwa', () => {
    describe('--tags', () => {
      it('should add tags to nx.json', async (done) => {
        const plugin = uniq('pwa');
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
        await runNxCommandAsync(
          `generate @nxext/stencil:pwa ${plugin} --style='scss'`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');

        done();
      });
    });
  });

  describe('e2e-ionic-app', () => {
    describe('stencil ionic app builder', () => {
      it(`should build ionic app`, async (done) => {
        const plugin = uniq('ionic-app');
        await runNxCommandAsync(
          `generate @nxext/stencil:ionic-app ${plugin} --style=css`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');

        done();
      });
    });
  });

  describe('stencil builderoptions', () => {
    it(`should build with custom stencil config naming`, async (done) => {
      const plugin = uniq('library');

      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss --buildable`
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
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss --buildable`
      );

      const result = await runNxCommandAsync(
        `build ${plugin} --configPath=libs/${plugin}/stencil.config.ts`
      );
      expect(result.stdout).toContain('build finished');

      done();
    });
  });

  describe('application', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('app3');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --tags e2etag,e2ePackage --style=css`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });

    it(`should build app with scss`, async (done) => {
      const plugin = uniq('app2');
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
