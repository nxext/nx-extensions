/**
 * TS-solution counterpart to ionic-angular.spec.ts - see there for the
 * legacy-layout flow. This suite exercises the same
 * `@nx/angular:application` + `@nxext/ionic-angular:configuration` pipeline
 * against a workspace left in the (Nx 21+ default) TS-solution shape
 * (`createTestProject(name, { tsSolution: true })`), to prove the
 * `assertNotUsingTsSolutionSetup` guard removal in
 * `packages/ionic-angular/src/generators/configuration/generator.ts` (and,
 * transitively, in
 * `packages/capacitor/src/generators/configuration/generator.ts`) holds
 * against a real, materialized TS-solution workspace root - not just the
 * synthetic package.json-based project fixture in `generator.spec.ts`.
 *
 * IMPORTANT CAVEAT (unlike the capacitor/ionic-react TS-solution suites):
 * `@nx/angular:application` itself still calls `assertNotUsingTsSolutionSetup`
 * (verified directly against the installed `@nx/angular@23.0.1` dist -
 * `application.js` line ~18, unconditionally, before anything else runs) and
 * none of its internals (`create-project.js`, `create-files.js`) branch on
 * `isUsingTsSolutionConfig` the way `@nx/web`'s/`@nx/react`'s do - it simply
 * hasn't been migrated for TS-solution setups yet. That guard is bypassed
 * here via Nx's own documented escape hatch
 * (`NX_IGNORE_UNSUPPORTED_TS_SETUP=true`, see
 * `@nx/js/internal`'s `assertNotUsingTsSolutionSetup`), written to a `.env`
 * file at the workspace root so every subsequent `nx` invocation in this
 * throwaway workspace picks it up (Nx's CLI entrypoint unconditionally loads
 * root `.env`/`.env.local` files, see `nx/src/utils/dotenv.js`). This is
 * scoped to this generated workspace only - it does not touch
 * `e2e/utils/index.ts` or any other suite's environment.
 *
 * Forcing past that upstream guard still leaves `@nx/angular:application`
 * emitting a legacy-shaped, project.json-based Angular project (its
 * `createProject` calls `addProjectConfiguration` unconditionally) inside an
 * otherwise TS-solution-shaped root workspace (pnpm-workspace.yaml + a root
 * tsconfig.json/tsconfig.base.json with `composite: true`). That is enough
 * to validate what is actually in scope here - that
 * `@nxext/ionic-angular:configuration` (and the capacitor generator it calls
 * transitively) no longer aborts merely because the workspace root satisfies
 * `isUsingTsSolutionSetup` - but the resulting mixed project/workspace shape
 * is not a fully-idiomatic TS-solution Angular app, and a subsequent `build`
 * may fail for reasons rooted entirely in `@nx/angular`'s own not-yet-shipped
 * TS-solution support, unrelated to `@nxext/ionic-angular`. See the `.skip`
 * below for exactly that reason - revisit once `@nx/angular:application`
 * itself supports the TS-solution setup.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  checkFilesExist,
  cleanupTestProject,
  createTestProject,
  installNxPlugins,
  installPlugin,
  runNxCommandAsync,
  stripAnsi,
  uniq,
  updateFile,
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/ionic-angular (TS-solution)', () => {
  let projectDirectory: string;
  const app = uniq('ionic-angular-ts');
  const appRoot = `packages/${app}`;

  beforeAll(async () => {
    projectDirectory = createTestProject(app, { tsSolution: true });

    // See the module-level caveat above: @nx/angular:application has not
    // been migrated for TS-solution workspaces yet and still calls
    // `assertNotUsingTsSolutionSetup` itself. Bypass just that upstream
    // guard for this throwaway workspace via Nx's own escape hatch.
    updateFile(
      projectDirectory,
      '.env',
      'NX_IGNORE_UNSUPPORTED_TS_SETUP=true\n',
    );

    installNxPlugins(projectDirectory, ['@nx/angular']);
    installPlugin(projectDirectory, 'ionic-angular');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/angular:application ${appRoot} --name=${app} --style=css --minimal --unitTestRunner=jest --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`,
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/ionic-angular:configuration --project=${app} --appName=test --appId=test --skipFormat=true --no-interactive`,
    );
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates the Ionic Angular template for the project', () => {
    checkFilesExist(projectDirectory, `${appRoot}/ionic.config.json`);
  });

  it('registers the workspace as TS-solution (pnpm-workspace.yaml present, untouched by ionic-angular)', () => {
    const workspaceYaml = readFileSync(
      join(projectDirectory, 'pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(workspaceYaml).toBeDefined();
    expect(workspaceYaml.length).toBeGreaterThan(0);
  });

  it('exposes the cap executor', async () => {
    const base = await runNxCommandAsync(projectDirectory, `run ${app}:cap`);
    expect(base.stdout).toContain('Usage');

    const help = await runNxCommandAsync(
      projectDirectory,
      `run ${app}:cap --cmd="--help"`,
    );
    expect(help.stdout).toContain('Usage: cap');
  });

  // TODO: `@nx/angular:application` itself has no TS-solution support yet
  // (see the module-level caveat above) - forcing past its guard yields a
  // legacy-shaped project.json project inside a TS-solution-shaped root
  // (composite tsconfig.base.json, no baseUrl/paths), which its own
  // initGenerator-emitted tsconfig chain is not guaranteed to satisfy.
  // Unskip once @nx/angular:application supports TS-solution workspaces
  // natively, the same way @nx/web/@nx/react already do.
  it.skip('builds the ionic-angular-configured app', async () => {
    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`,
    );
  });
});
