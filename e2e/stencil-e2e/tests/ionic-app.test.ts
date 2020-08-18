import { ProjectType } from '@nrwl/workspace';
import {
  checkFilesExist,
  ensureNxProject, readFile, readJson,
  runNxCommandAsync, runYarnInstall, tmpProjPath,
  uniq, updateFile
} from '@nrwl/nx-plugin/testing';
import { testProject } from '../utils/testing';

function addPackageBeforeTest(pkg) {
  const packageJsonPath = tmpProjPath('package.json');
  const packageJsonFile = readJson(packageJsonPath);
  packageJsonFile.devDependencies = {
    ...packageJsonFile.devDependencies,
    ...pkg
  };
  updateFile(packageJsonPath, JSON.stringify(packageJsonFile));
  runYarnInstall();
}

describe('e2e-pwa', () => {
  describe('stencil ionic app', () => {
    it(`should create ionic app with css`, async (done) => {
      const plugin = uniq('ionic-app');

      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');

      addPackageBeforeTest({"@nxtend/capacitor": "^1.0.0"});

      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='css' --appTemplate='Tabs'`
      );



      testProject(plugin, 'css', ProjectType.Application);

      done();
    });
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('ionic-app');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      addPackageBeforeTest({"@nxtend/capacitor": "^1.0.0"});

      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --directory subdir --style=css --appTemplate='Tabs'`
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
      addPackageBeforeTest({"@nxtend/capacitor": "^1.0.0"});

      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --style='scss' --appTemplate='Tabs'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');

      done();
    });

    it('should add capacitor project', async (done) => {
      const plugin = uniq('ionic-app');
      ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
      addPackageBeforeTest({"@nxtend/capacitor": "^1.0.0"});

      await runNxCommandAsync(
        `generate @nxext/stencil:ionic-app ${plugin} --tags e2etag,e2ePackage --style=css --appTemplate='Tabs'`
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
