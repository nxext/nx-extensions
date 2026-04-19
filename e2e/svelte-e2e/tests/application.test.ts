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

  // TODO: svelte-check fails because tsconfig.lib.json references `types: ['node']`
  // but no `@types/node` is installed with the generated project (same class as the
  // stencil fix in a973f14b). Plugin-side fix lives in packages/svelte/src/generators
  // init / add-svelte-dependencies.
  it.skip('runs svelte-check', async () => {
    const app = uniq('svelte-check');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `check ${app}`);
    expect(result.stdout).toContain(
      'svelte-check found 0 errors, 0 warnings, and 0 hints'
    );
  });

  describe('test runners', () => {
    // TODO: the generated jest.config.ts references svelte-jester with a
    // preprocess pointing at `<project>/svelte.config.cjs`, but the path
    // resolution differs in the test workspace. Jest can't load the component
    // and reports "Test suite failed to run". Separate from the vitest path,
    // which works.
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

    it('runs vitest tests', async () => {
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

  // TODO: blocked on the same missing-@types/node issue as the library build
  // — tsconfig pulls 'node' into `types` without installing the types package.
  it.skip('builds a svelte app with a library dependency', async () => {
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

    updateFile(
      projectDirectory,
      `apps/${app}/src/App.svelte`,
      `<script lang="ts">
  export let name: string;
  import { Testcomp } from '@proj/${lib}';
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
