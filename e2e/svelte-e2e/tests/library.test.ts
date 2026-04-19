/**
 * Reference real-install e2e for @nxext/svelte library. See stencil-e2e for
 * the flow overview.
 */
import {
  cleanupTestProject,
  createTestProject,
  installPlugin,
  runNxCommandAsync,
  stripAnsi,
  uniq,
  updateFile,
} from '@nxext/e2e-utils';
import { names } from '@nx/devkit';

jest.setTimeout(600_000);

describe('@nxext/svelte: library', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'svelte');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('lints a svelte lib', async () => {
    const lib = uniq('svelte-lib-lint');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `lint ${lib}`);
    expect(result.stdout).toContain('All files pass linting');
  });

  it('runs svelte-check on a lib', async () => {
    const lib = uniq('svelte-lib-check');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `check ${lib}`);
    expect(result.stdout).toContain(
      'svelte-check found 0 errors, 0 warnings, and 0 hints'
    );
  });

  it('builds a buildable svelte lib', async () => {
    const lib = uniq('svelte-lib');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --buildable --e2eTestRunner=none --unitTestRunner=none --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `build ${lib}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${lib}`
    );
  });

  describe('test runners', () => {
    // TODO: same svelte-jester preprocess path issue as the application
    // jest test. Vitest works; jest doesn't.
    it.skip('runs jest tests on a lib', async () => {
      const lib = uniq('svelte-lib-jest');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:lib libs/${lib} --unitTestRunner=jest --e2eTestRunner=none --no-interactive`
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:component test --project=${lib} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `test ${lib}`);
      expect(`${result.stdout}${result.stderr}`).toContain(
        'Ran all test suites'
      );
    });

    it('runs vitest tests on a lib', async () => {
      const lib = uniq('svelte-lib-vitest');
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:lib libs/${lib} --unitTestRunner=vitest --e2eTestRunner=none --no-interactive`
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/svelte:component test --project=${lib} --no-interactive`
      );

      const result = await runNxCommandAsync(projectDirectory, `test ${lib}`);
      expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
        `Successfully ran target test for project ${lib}`
      );
    });
  });

  // TODO: the svelte storybook-configuration generator was written against
  // Storybook <10. Storybook 10 in the e2e workspace needs the ESM-first
  // migration (see tools/ai-migrations/MIGRATE_STORYBOOK_10.md pattern) that
  // our plugin source still has open. Unskip once the generator emits ESM
  // `.storybook/main.ts`.
  it.skip('builds a storybook from a svelte lib', async () => {
    const lib = uniq('svelte-storybook');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --unitTestRunner=none --e2eTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:storybook-configuration ${lib} --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:component test --project=${lib} --no-interactive`
    );

    const result = await runNxCommandAsync(
      projectDirectory,
      `build-storybook ${lib}`
    );
    expect(`${result.stdout}${result.stderr}`).toContain(
      'Storybook builder finished'
    );
  });

  // TODO: same `@proj/<lib>` path-alias resolution gap as the application
  // "library dependency" test — the lib generator doesn't update
  // tsconfig.base.json paths, so Vite can't resolve the sibling import.
  it.skip('builds a svelte app that imports a sibling svelte lib', async () => {
    const app = uniq('svelte-link-app');
    const lib = uniq('svelte-link-lib');
    const libClassName = names(lib).className;

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:app apps/${app} --unitTestRunner=none --e2eTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:lib libs/${lib} --buildable --unitTestRunner=none --e2eTestRunner=none --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/svelte:c ${libClassName} --project=${lib} --no-interactive`
    );

    updateFile(
      projectDirectory,
      `apps/${app}/src/App.svelte`,
      `<script lang="ts">
  import { ${libClassName} } from '@proj/${lib}';
</script>

<main>
  <${libClassName} msg="Yey"></${libClassName}>
</main>
`
    );

    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`
    );
  });
});
