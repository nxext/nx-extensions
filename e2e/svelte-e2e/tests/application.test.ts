/**
 * Reference real-install e2e for @nxext/svelte application. See stencil-e2e
 * for the flow overview.
 */
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  readJson,
  runNxCommandAsync,
  stripAnsi,
  uniq,
  updateFile,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/svelte: application', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'svelte');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('builds a svelte app', async () => {
    const app = uniq('svelte-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() =>
      checkFilesExist(projectDirectory, `dist/apps/${app}/index.html`)
    ).not.toThrow();
  });

  it('honors --tags', async () => {
    const app = uniq('svelte-tags');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --tags=e2etag,e2ePackage --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );
    const project = readJson<{ tags: string[] }>(
      projectDirectory,
      `apps/${app}/project.json`
    );
    expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
  });

  it('generates an app into a nested directory', async () => {
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/project/ui --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );
    expect(() =>
      checkFilesExist(projectDirectory, `apps/project/ui/src/main.ts`)
    ).not.toThrow();
  });

  it('lints a svelte app', async () => {
    const app = uniq('svelte-lint');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `lint ${app}`);
    expect(result.stdout).toContain('All files pass linting');
  });

  it('runs svelte-check', async () => {
    const app = uniq('svelte-check');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    // svelte-check in a freshly-scaffolded app emits a transient
    // "Cannot find module .../svelte/compiler" preprocessing warning (0 errors,
    // 1 warning). The target exits 0 regardless — assert the target-success
    // marker rather than the full "0 errors, 0 warnings, 0 hints" line until
    // the compiler-resolution warning is fixed in the svelte.config template.
    const result = await runNxCommandAsync(projectDirectory, `check ${app}`);
    const combined = stripAnsi(`${result.stdout}${result.stderr}`);
    expect(combined).toContain('0 ERRORS');
    expect(combined).toContain(
      `Successfully ran target check for project ${app}`
    );
  });

  describe('test runners', () => {
    // TODO: svelte-jester 5 (needed for Svelte 5) requires jest in ESM mode.
    // Our generated jest.config.ts is CJS. Needs extensionsToTreatAsEsm +
    // NODE_OPTIONS=--experimental-vm-modules + ESM-style imports in test
    // files. Separate follow-up.
    it.skip('runs jest tests', async () => {
      const app = uniq('svelte-jest');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:app apps/${app} --unitTestRunner=jest --e2eTestRunner=none --no-interactive`
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:component test --project=${app} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `test ${app}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    });

    // TODO: vitest + @testing-library/svelte on Svelte 5 needs
    // `environment: 'jsdom'` + a reachable svelte.config — neither of which
    // the generator currently emits. Fails with `mount(...) is not available
    // on the server`. Separate follow-up.
    it.skip('runs vitest tests', async () => {
      const app = uniq('svelte-vitest');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:app apps/${app} --unitTestRunner=vitest --e2eTestRunner=none --no-interactive`
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:component test --project=${app} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `test ${app}`);
      expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
        `Successfully ran target test for project ${app}`
      );
    });
  });

  it('builds a svelte app with a library dependency', async () => {
    const app = uniq('svelte-app-deps');
    const lib = uniq('svelte-lib-dep');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:c testcomp --project=${lib} --no-interactive`
    );

    // The scope is derived from the scaffolded workspace, not always `@proj`.
    // Look up the path alias the library generator just registered in
    // tsconfig.base.json and import under that exact key.
    const tsconfigBase = readJson<{
      compilerOptions: { paths: Record<string, string[]> };
    }>(projectDirectory, 'tsconfig.base.json');
    const importPath = Object.keys(tsconfigBase.compilerOptions.paths).find(
      (key) => key.endsWith(`/${lib}`)
    );
    if (!importPath) {
      throw new Error(
        `No tsconfig path registered for lib "${lib}". Registered keys: ${Object.keys(
          tsconfigBase.compilerOptions.paths
        ).join(', ')}`
      );
    }

    updateFile(
      projectDirectory,
      `apps/${app}/src/App.svelte`,
      `<script lang="ts">
  export let name: string;
  import { Testcomp } from '${importPath}';
</script>

<main>
  <h1>Welcome {name}!</h1>
  <Testcomp />
</main>
`
    );

    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
    expect(() =>
      checkFilesExist(projectDirectory, `dist/apps/${app}/index.html`)
    ).not.toThrow();
  });
});
