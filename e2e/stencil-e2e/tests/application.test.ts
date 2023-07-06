import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
  runCommand,
} from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('application e2e', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'stencil');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  describe('app', () => {
    it(`should build app with css`, async () => {
      const plugin = uniq('app2');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(`build ${plugin} --dev`);
      expect(result.stdout).toContain('build finished');
      expect(() => {
        checkFilesExist(
          `dist/apps/${plugin}/www/index.html`,
          `dist/apps/${plugin}/www/host.config.json`
        );
      }).not.toThrow();
    });

    it(`should be able to run e2e`, async () => {
      const plugin = uniq('app2');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='puppeteer' --junitTestRunner='none'`
      );
      runCommand(
        `yarn add -D @types/jest@27.0.3 jest@27.0.3 jest-cli@27.4.5`,
        {}
      );

      const result = await runNxCommandAsync(`e2e ${plugin} `);
      expect(result.stdout).toContain('build finished');
    });

    it(`should build app with prerender parameter`, async () => {
      const plugin = uniq('app-prerender');
      await runNxCommandAsync(
        `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
      );

      const result = await runNxCommandAsync(
        `build ${plugin} --prerender=true`
      );
      expect(result.stdout).toContain('build finished');
      expect(() => {
        checkFilesExist(
          `dist/apps/${plugin}/www/index.html`,
          `dist/apps/${plugin}/www/host.config.json`
        );
      }).not.toThrow();
    });
  });

  describe('pwa', () => {
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
