import {
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('library e2e', () => {
  beforeAll(() => {
    ensureNxProject('@nxext/stencil', 'dist/packages/stencil');
  });

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