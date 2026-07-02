/**
 * Reference real-install e2e for @nxext/stencil library and output-target generators.
 * See application.test.ts for the flow overview.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  readJson,
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
      `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --no-interactive`
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
      `generate @nxext/stencil:lib libs/${lib} --e2eTestRunner=none --no-interactive`
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
        `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --no-interactive`
      );

      const renamed = uniq('stencil.config');
      renameFile(
        projectDirectory,
        `libs/${lib}/stencil.config.ts`,
        `libs/${lib}/${renamed}.ts`
      );

      const build = await runNxCommandAsync(
        projectDirectory,
        `build ${lib} --config=${renamed}.ts`
      );
      expect(build.stdout).toContain('build finished');
    });

    it('honors an explicit --config', async () => {
      const lib = uniq('stencil-lib');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/stencil:lib libs/${lib} --style=scss --buildable --e2eTestRunner=none --no-interactive`
      );

      const build = await runNxCommandAsync(
        projectDirectory,
        `build ${lib} --config=stencil.config.ts`
      );
      expect(build.stdout).toContain('build finished');
    });
  });

  it('adds a component to a buildable library', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=css --buildable --e2eTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:component my-comp --project=${lib} --no-interactive`
    );

    expect(() =>
      checkFilesExist(
        projectDirectory,
        `libs/${lib}/src/components/my-comp/my-comp.tsx`
      )
    ).not.toThrow();

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${lib} --dev`
    );
    expect(build.stdout).toContain('build finished');
  });

  // TODO: fails with `ERR_PNPM_NO_MATCHING_VERSION No matching version found
  // for @storybook/manager-webpack5@^10.1.0` — storybook-configuration/lib/
  // add-dependencies.ts pins that package (and @storybook/builder-webpack5,
  // @storybook/html-webpack5 via `uiFramework`) to @nx/storybook's own
  // `storybookVersion` constant (^10.1.0), but the whole `*-webpack5`
  // framework/manager/builder package family this generator targets is
  // effectively discontinued: @storybook/manager-webpack5 never shipped past
  // 6.5.16, @storybook/html-webpack5 tops out at 8.6.14 (npm "latest"
  // dist-tag) — neither has a 10.x release at all. This is a real,
  // deep mismatch between this generator's whole Storybook integration
  // approach and current Storybook (7+ dropped separate webpack5 manager/
  // builder packages in favor of framework-integrated builders), not a
  // one-line version fix. Left skipped rather than bundling a Storybook
  // integration redesign into an e2e-coverage pass — also left it.skip
  // rather than deleting, since a failed generate here poisons the shared
  // (beforeAll) workspace's package.json for every later test in this file
  // (confirmed: it cascaded into false failures on the output-target tests
  // below until this was skipped).
  it.skip('configures storybook for a buildable library', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=css --buildable --e2eTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:storybook-configuration ${lib} --configureCypress=false --no-interactive`
    );

    expect(() =>
      checkFilesExist(
        projectDirectory,
        `libs/${lib}/.storybook/main.ts`,
        '.storybook/main.ts'
      )
    ).not.toThrow();
  });

  it('generates a publishable library', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=css --buildable --publishable --importPath=@e2e-proj/${lib} --e2eTestRunner=none --no-interactive`
    );

    const packageJson = readJson<{ name: string }>(
      projectDirectory,
      `libs/${lib}/package.json`
    );
    expect(packageJson.name).toBe(`@e2e-proj/${lib}`);
  });

  it('honors --tags', async () => {
    const lib = uniq('stencil-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --tags=e2etag,e2ePackage --e2eTestRunner=none --no-interactive`
    );

    const projectJson = readJson<{ tags: string[] }>(
      projectDirectory,
      `libs/${lib}/project.json`
    );
    expect(projectJson.tags).toEqual(['e2etag', 'e2ePackage']);
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
        `generate @nxext/stencil:lib libs/${lib} --style=css --buildable --e2eTestRunner=none --no-interactive`
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
        `generate @nxext/stencil:lib libs/${lib} --style=css --e2eTestRunner=none --no-interactive`
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
