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

  xdescribe('library', () => {
    describe('outputtarget', () => {
      it(`should generate react lib`, async () => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
        );
        await runNxCommandAsync(
          `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=react`
        );

        expect(() =>
          checkFilesExist(`libs/${plugin}-react/src/index.ts`)
        ).not.toThrow();
      });

      it(`should generate angular lib`, async () => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
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
      });

      it(`should stop if lib not buildable`, async () => {
        const plugin = uniq('lib');
        await runNxCommandAsync(
          `generate @nxext/stencil:lib ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
        );
        const result = await runNxCommandAsync(
          `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=angular`
        );

        expect(result.stdout).toContain(
          'Please use a buildable library for custom outputtargets'
        );
      });
    });

    it('should add tags to nx.json', async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --tags e2etag,e2ePackage --style=css --e2eTestRunner='none' --junitTestRunner='none'`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it(`should build app with scss`, async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='scss' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');
    });

    it('should be able to make a lib buildable', async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:make-lib-buildable ${plugin} --importPath=@my/lib`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      expect(() =>
        checkFilesExist(`libs/${plugin}/stencil.config.ts`)
      ).not.toThrow();
    });
  });

  xdescribe('e2e-pwa', () => {
    describe('stencil app builder', () => {
      it(`should build pwa app with scss`, async () => {
        const plugin = uniq('pwa');
        await runNxCommandAsync(
          `generate @nxext/stencil:pwa ${plugin} --style='scss' --e2eTestRunner='none' --junitTestRunner='none'`
        );

        const result = await runNxCommandAsync(`build ${plugin} --dev`);
        expect(result.stdout).toContain('build finished');
      });
    });
  });

  xdescribe('stencil builderoptions', () => {
    it(`should build with custom stencil config naming`, async () => {
      const plugin = uniq('library');

      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss --buildable --e2eTestRunner='none' --junitTestRunner='none'`
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
    });

    it(`should build with custom configPath`, async () => {
      const plugin = uniq('library');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style=scss --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(
        `build ${plugin} --configPath=libs/${plugin}/stencil.config.ts`
      );
      expect(result.stdout).toContain('build finished');
    });
  });

 xdescribe('application', () => {
    it('should add tags to nx.json', async () => {
      const plugin = uniq('app3');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --tags e2etag,e2ePackage --style=css --e2eTestRunner='none' --junitTestRunner='none'`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it(`should build app with css`, async () => {
      const plugin = uniq('app2');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');
      expect(() => {
        checkFilesExist(
          normalize(`dist/apps/${plugin}/www/index.html`),
          normalize(`dist/apps/${plugin}/www/host.config.json`)
        );
      }).not.toThrow();
    });
  });

  describe('Storybook', () => {
    it('should build', async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(`generate @nxext/stencil:storybook-configuration ${plugin} --configureCypress=false`);
      await runNxCommandAsync(`generate @nxext/stencil:component test-comp --project=${plugin}`)
      await runNxCommandAsync(`build ${plugin}`);

      const result = await runNxCommandAsync(`build-storybook ${plugin}`);
      expect(result.stdout).toContain('Storybook builder finished ...');
    })
  })
});
