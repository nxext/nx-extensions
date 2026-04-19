/**
 * Reference real-install e2e for @nxext/stencil library and output-target generators.
 * See application.test.ts for the flow overview.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  renameFile,
  runNxCommandAsync,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/stencil: library', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'stencil');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates and builds a buildable library (scss)', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --junitTestRunner=none --no-interactive`
    );

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${lib} --dev`
    );
    expect(build.stdout).toContain('build finished');
  });

  it('promotes a non-buildable library via make-lib-buildable', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --e2eTestRunner=none --junitTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:make-lib-buildable ${lib} --importPath=@my/${lib}`
    );

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${lib} --dev`
    );
    expect(build.stdout).toContain('build finished');
    expect(() =>
      checkFilesExist(projectDirectory, `libs/${lib}/stencil.config.ts`)
    ).not.toThrow();
  });

  describe('build options', () => {
    it('honors a renamed stencil config file', async () => {
      const lib = uniq('stencil-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const renamed = uniq('stencil.config');
      renameFile(
        projectDirectory,
        `libs/${lib}/stencil.config.ts`,
        `libs/${lib}/${renamed}.ts`
      );

      const build = await runNxCommandAsync(
        projectDirectory,
        `build ${lib} --configPath=libs/${lib}/${renamed}.ts`
      );
      expect(build.stdout).toContain('build finished');
    });

    it('honors an explicit --configPath', async () => {
      const lib = uniq('stencil-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );

      const build = await runNxCommandAsync(
        projectDirectory,
        `build ${lib} --configPath=libs/${lib}/stencil.config.ts`
      );
      expect(build.stdout).toContain('build finished');
    });
  });

  describe('output targets', () => {
    it.each([
      ['react', (lib: string) => [`libs/${lib}-react/src/index.ts`]],
      ['vue', (lib: string) => [`libs/${lib}-vue/src/index.ts`]],
      ['angular', (lib: string) => [`libs/${lib}-angular/src/index.ts`]],
    ])('generates a %s sibling library', async (outputType, expectedFiles) => {
      const lib = uniq('stencil-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:lib libs/${lib} --style=css --buildable --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:add-outputtarget ${lib} --outputType=${outputType}`
      );
      await runNxCommandAsync(projectDirectory, `build ${lib}`);

      expect(() =>
        checkFilesExist(projectDirectory, ...expectedFiles(lib))
      ).not.toThrow();
    });

    it('refuses to add an output target to a non-buildable library', async () => {
      const lib = uniq('stencil-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:lib libs/${lib} --style=css --e2eTestRunner=none --junitTestRunner=none --no-interactive`
      );
      const result = await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:add-outputtarget ${lib} --outputType=angular`
      );

      expect(result.stdout).toContain(
        'Please use a buildable library for custom outputtargets'
      );
    });
  });
});
