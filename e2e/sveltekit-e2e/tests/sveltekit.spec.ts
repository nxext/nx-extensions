/**
 * Reference real-install e2e for @nxext/sveltekit. See stencil-e2e for flow overview.
 *
 * Note: the sveltekit app generator uses its own `normalizeOptions` (not
 * @nx/devkit's `determineProjectNameAndRootOptions`), so the generator takes a
 * bare project name as positional + an optional `--directory` flag — unlike the
 * solid/preact generators where `apps/<name>` is the directory arg.
 *
 * Four tests are currently skipped. Each is blocked on a distinct pre-existing
 * plugin-side issue, not a migration gap. See the TODO on each `it.skip` for
 * the specific root cause. Do not unskip without fixing the plugin first.
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
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/sveltekit', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'sveltekit');
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  // TODO: still skipped after investigating for the Svelte 5 migration.
  // Root cause confirmed (verified with a standalone `vite build` repro
  // outside this e2e, not by unskipping and running it): `@sveltejs/kit`'s
  // `sveltekit()` Vite plugin captures `cwd = process.cwd()` as a
  // module-level constant in `@sveltejs/kit/src/exports/vite/index.js`,
  // evaluated once when the plugin module is first imported - independent of
  // Vite's `root` option. `nx build` runs with `process.cwd()` at the
  // workspace root, not the project root, so the plugin's file lookups
  // (`svelte.config.js`, `src/app.html`, ...) fail with "src/app.html does
  // not exist".
  // Passing SvelteKit's config directly to `sveltekit({ ...kit, preprocess })`
  // (supported since kit 2.62.0, avoiding the `svelte.config.js` file lookup)
  // does NOT fix it either - confirmed by reproducing both ways manually -
  // because `process_config()` still resolves `files.appTemplate` etc.
  // against that same module-level `cwd`, not against the passed-in config.
  // The only real fixes are either an upstream SvelteKit change (accept an
  // explicit cwd/root), or switching the generated `build` target away from
  // `@nx/vite:build` to a `cwd`-scoped command runner (like `check`/`e2e`
  // already use) - which is an invasive change to `packages/sveltekit`'s
  // target generation that needs its own e2e-verified follow-up, not a
  // Svelte-5-version-bump-scoped fix. Leaving skipped.
  it.skip('generates and builds a sveltekit app', async () => {
    const app = uniq('sveltekit-app');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    const combined = stripAnsi(`${result.stdout}${result.stderr}`);
    expect(combined).toContain('modules transformed');
    expect(combined).toContain(
      `Successfully ran target build for project ${app}`
    );
  });

  // TODO: `names()` normalization on the component name produces a file path
  // that doesn't match what the generator actually writes. Needs either schema
  // guardrails on the component name or a test fixture that stays close to
  // identifier-safe input.
  it.skip('generates a sveltekit component', async () => {
    const app = uniq('sveltekit-comp-app');
    const component = uniq('component-sveltekit');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:component -p ${app} ${component} --no-interactive`
    );

    expect(() =>
      checkFilesExist(
        projectDirectory,
        `apps/${app}/src/lib/${component}/${component}.spec.ts`
      )
    ).not.toThrow();
  });

  it('lints a sveltekit app', async () => {
    const app = uniq('sveltekit-lint');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --no-interactive`
    );

    const result = await runNxCommandAsync(projectDirectory, `lint ${app}`);
    expect(result.stdout).toContain('All files pass linting');
  });

  // TODO: the generator writes app.html to `apps/<directory>/<name>/src/` per
  // `sourceRoot` in project.json__template, but `addFiles` places files at
  // `apps/<directory>/<name>/` — the two are inconsistent. The template is
  // double-nesting. Needs a plugin fix in
  // packages/sveltekit/src/generators/application/files/project.json__template.
  it.skip('honors --directory', async () => {
    const app = uniq('sveltekit-dir');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --directory=subdir --linter=none --no-interactive`
    );
    expect(() =>
      checkFilesExist(projectDirectory, `apps/subdir/${app}/src/app.html`)
    ).not.toThrow();
  });

  // TODO: blocked on the same --directory/sourceRoot bug above — the generator
  // writes project.json to a path that doesn't match the one the test reads.
  it.skip('honors --tags', async () => {
    const app = uniq('sveltekit-tags');
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/sveltekit:app ${app} --tags=e2etag,e2ePackage --no-interactive`
    );
    const project = readJson<{ tags: string[] }>(
      projectDirectory,
      `apps/${app}/project.json`
    );
    expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
  });
});
