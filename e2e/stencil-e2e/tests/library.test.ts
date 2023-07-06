import {
  checkFilesExist,
  renameFile,
  runNxCommandAsync,
  uniq,
} from '@nx/plugin/testing';
import {
  createTestProject,
  installPlugin,
  runNxCommandUntil,
} from '@nxext/e2e-utils';
import { rmSync } from 'fs';

describe('library e2e', () => {
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

  it('should be able to build a lib with prerender', async () => {
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

  describe('buildoptions', () => {
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

  describe('outputtargets', () => {
    it(`should generate react lib`, async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=react`
      );
      await runNxCommandAsync(`build ${plugin}`);

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
          `libs/${plugin}-angular/src/lib/${plugin}-angular.module.ts`
        )
      ).not.toThrow();
    });

    xit(`should generate svelte lib`, async () => {
      const plugin = uniq('lib');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=svelte`
      );

      expect(() =>
        checkFilesExist(`libs/${plugin}-svelte/src/index.ts`)
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

  xdescribe('storybook', () => {
    it('should build', async () => {
      const plugin = uniq('build-storybook');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:storybook-configuration ${plugin} --configureCypress=false`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:component test-comp --project=${plugin}`
      );
      await runNxCommandAsync(`build ${plugin}`);

      const result = await runNxCommandAsync(`build-storybook ${plugin}`);
      expect(result.stdout).toContain('Storybook builder finished ...');
    });

    it('should serve', async () => {
      const plugin = uniq('storybook');
      await runNxCommandAsync(
        `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:storybook-configuration ${plugin} --configureCypress=false`
      );
      await runNxCommandAsync(
        `generate @nxext/stencil:component test-comp --project=${plugin}`
      );

      await runNxCommandUntil(`storybook ${plugin}`, (output) => {
        return /Storybook.*started/gi.test(output);
      });
    });
  });
});
