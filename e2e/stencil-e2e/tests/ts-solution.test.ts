/**
 * TS-solution e2e for @nxext/stencil (mirrors @nxext/svelte's
 * `ts-solution.test.ts` pilot).
 *
 * Unlike application.test.ts/library.test.ts, this suite scaffolds the test
 * workspace with `{ tsSolution: true }` (see `createTestProject` in
 * `@nxext/e2e-utils`): the workspace is NOT downgraded to the legacy
 * apps-libs/project.json layout, so it stays in the real, non-downgraded
 * TS-solution shape (package-manager workspaces, package.json-based
 * projects, TS project references) that ships by default since Nx 21/22.
 *
 * The workspace's npm scope is NOT `@proj` here (that's a `create-nx-workspace`
 * convention tied to older presets) - the current `--preset=apps` scaffold
 * maps to a template whose root package.json name varies by Nx version.
 * Every assertion below therefore reads the actually-generated package.json
 * `name` field back out instead of assuming any particular scope string.
 *
 * Unlike svelte (Vite-based, `@nx/vite` branches its own build output
 * location on `isUsingTsSolutionSetup`), Stencil's own compiler drives the
 * build directly via the Crystal-inferred `stencil build` command - the
 * `dir`/`baseUrl` output-target paths baked into the generated
 * `stencil.config.ts` are identical in both modes (see
 * `packages/stencil/src/generators/application/files/common/stencil.config.ts.template`),
 * so a TS-solution app still builds into the legacy-shaped
 * `dist/apps/<app>/www` - only the tsconfig shape and project.json/package.json
 * registration differ between modes.
 *
 * Also unlike svelte, Stencil projects do NOT participate in TS project
 * references: Stencil force-overrides `declaration: false` for www builds
 * (incompatible with `composite`) and only preserves `moduleResolution:
 * bundler`, so the generated per-project tsconfig.json is a standalone,
 * non-composite Stencil config that does not extend the workspace's
 * TS-solution base - and non-composite projects must not be referenced by
 * the root solution tsconfig.json (TS6306). Workspace (pnpm-workspace.yaml)
 * registration still happens - that's what backs project-graph discovery
 * and the cross-project package-manager symlinks.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  readFile,
  readJson,
  runNxCommandAsync,
  stripAnsi,
  uniq,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/stencil: TS-solution mode', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject('proj', { tsSolution: true });
    installPlugin(projectDirectory, 'stencil');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates a package.json-based app (no project.json) that builds and lints', async () => {
    const app = uniq('ts-solution-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --no-interactive`,
    );

    expect(() =>
      checkFilesExist(projectDirectory, `apps/${app}/package.json`),
    ).not.toThrow();
    expect(() =>
      checkFilesExist(projectDirectory, `apps/${app}/project.json`),
    ).toThrow();

    // TS-solution: no explicit --name was given, so the registered Nx
    // project identifier is the resolved import path (package.json name),
    // not the bare directory basename `app`.
    const appPackageJson = readJson<{
      name: string;
      nx?: { targets?: unknown };
    }>(projectDirectory, `apps/${app}/package.json`);
    const appProjectName = appPackageJson.name;
    // `lint` is the one target @nxext/stencil writes explicitly (build/serve/
    // test/e2e are inferred by the Crystal plugin from stencil.config.ts) -
    // see packages/stencil/src/generators/application/lib/add-project.ts.
    expect(appPackageJson.nx?.targets).toBeDefined();

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${appProjectName} --dev`,
    );
    expect(build.stdout).toContain('build finished');
    // Stencil's own build output location (dist/apps/<app>/www) is baked
    // into the generated stencil.config.ts identically in both modes - see
    // file header comment.
    expect(() =>
      checkFilesExist(
        projectDirectory,
        `dist/apps/${app}/www/index.html`,
        `dist/apps/${app}/www/host.config.json`,
      ),
    ).not.toThrow();

    const lint = await runNxCommandAsync(
      projectDirectory,
      `lint ${appProjectName}`,
    );
    expect(stripAnsi(lint.stdout)).toContain(
      `Successfully ran target lint for project ${appProjectName}`,
    );
  });

  it('registers the project in pnpm-workspace.yaml but NOT in the root tsconfig.json references', async () => {
    const app = uniq('ts-solution-registration');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:app apps/${app} --style=css --e2eTestRunner=none --no-interactive`,
    );

    const workspaceYaml = readFile(projectDirectory, 'pnpm-workspace.yaml');
    expect(workspaceYaml).toContain('apps');

    // Non-composite Stencil projects must not be referenced by the root
    // solution tsconfig (see file header) - and the generated project
    // tsconfig.json is standalone (no extends of the TS-solution base).
    const rootTsconfig = readJson<{ references?: { path: string }[] }>(
      projectDirectory,
      'tsconfig.json',
    );
    expect(rootTsconfig.references ?? []).not.toEqual(
      expect.arrayContaining([{ path: `./apps/${app}` }]),
    );

    const projectTsconfig = readJson<{
      extends?: string;
      compilerOptions: Record<string, unknown>;
    }>(projectDirectory, `apps/${app}/tsconfig.json`);
    expect(projectTsconfig.extends).toBeUndefined();
    expect(projectTsconfig.compilerOptions.moduleResolution).toBe('bundler');
  });

  it('generates a non-buildable package.json-based library with no tsconfig.base.json paths entry', async () => {
    const lib = uniq('ts-solution-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=css --e2eTestRunner=none --no-interactive`,
    );

    expect(() =>
      checkFilesExist(projectDirectory, `libs/${lib}/package.json`),
    ).not.toThrow();
    expect(() =>
      checkFilesExist(projectDirectory, `libs/${lib}/project.json`),
    ).toThrow();

    const libPackageJson = readJson<{ name: string; main?: string }>(
      projectDirectory,
      `libs/${lib}/package.json`,
    );
    // Non-buildable TS-solution libs still need a resolvable entry point
    // for other workspace projects consuming them via the package-manager
    // symlink (no separate build step) - see library/lib/add-project.ts.
    expect(libPackageJson.main).toBe('./src/index.ts');

    // Cross-project resolution goes through the package-manager workspace
    // symlink instead of a tsconfig.base.json `paths` entry (Design 1.6) -
    // library/generator.ts routes this through `maybeAddTsConfigPath`.
    const tsconfigBase = readJson<{
      compilerOptions: { paths?: Record<string, string[]> };
    }>(projectDirectory, 'tsconfig.base.json');
    expect(
      Object.keys(tsconfigBase.compilerOptions.paths ?? {}).some((key) =>
        key.endsWith(`/${lib}`),
      ),
    ).toBe(false);
  });

  it('promotes a package.json-based library to buildable via make-lib-buildable and still builds', async () => {
    const lib = uniq('ts-solution-buildable-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:lib libs/${lib} --style=css --e2eTestRunner=none --no-interactive`,
    );

    const libPackageJsonBefore = readJson<{ name: string }>(
      projectDirectory,
      `libs/${lib}/package.json`,
    );
    const libProjectName = libPackageJsonBefore.name;

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/stencil:make-lib-buildable ${libProjectName} --importPath=@my/${lib}`,
    );

    // make-lib-buildable overwrites package.json wholesale with Stencil's
    // dist-output shape (files/lib/package.json.template) - the
    // registration/lint-target metadata `addProjectPackageJson`/
    // `addProject` wrote earlier must survive that overwrite (the priorNx
    // capture/reapply in make-lib-buildable.ts's createFiles), or `nx
    // build`/`nx lint` below wouldn't be able to find the project's targets
    // at all.
    const libPackageJsonAfter = readJson<{
      name: string;
      main?: string;
      nx?: { targets?: unknown };
    }>(projectDirectory, `libs/${lib}/package.json`);
    expect(libPackageJsonAfter.name).toBe(`@my/${lib}`);
    expect(libPackageJsonAfter.main).toBe('./dist/index.cjs.js');
    expect(libPackageJsonAfter.nx?.targets).toBeDefined();

    const build = await runNxCommandAsync(
      projectDirectory,
      `build ${libPackageJsonAfter.name} --dev`,
    );
    expect(build.stdout).toContain('build finished');
  });
});
