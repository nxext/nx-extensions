/**
 * TS-solution counterpart to ionic-react.spec.ts - see there for the
 * legacy-layout flow. This suite scaffolds the same `@nx/react:application`
 * (vite + vitest) + `@nxext/ionic-react:configuration` pipeline against a
 * workspace left in the (Nx 21+ default) TS-solution shape
 * (`createTestProject(name, { tsSolution: true })`), to prove the
 * `assertNotUsingTsSolutionSetup` guard removal in
 * `packages/ionic-react/src/generators/configuration/generator.ts` (and,
 * transitively via `--capacitor`, in
 * `packages/capacitor/src/generators/configuration/generator.ts`) holds
 * end-to-end.
 *
 * `@nx/react:application` fully supports TS-solution workspaces already
 * (verified directly against the installed `@nx/react` dist:
 * `isUsingTsSolutionConfig` threads through normalize-options/add-project/
 * create-application-files, with no `assertNotUsingTsSolutionSetup` guard of
 * its own left), so this can scaffold exactly like the legacy suite, just
 * without the downgrade step.
 *
 * `--name=${app}` is passed explicitly for the same reason as in the
 * capacitor TS-solution suite: without it, the Nx project name would default
 * to the workspace's derived import path in TS-solution mode, making
 * `--project=` depend on the workspace's npm scope.
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
} from '@nxext/e2e-utils';

jest.setTimeout(600_000);

describe('@nxext/ionic-react (TS-solution)', () => {
  let projectDirectory: string;
  const app = uniq('ionic-react-ts');
  const appRoot = `packages/${app}`;

  beforeAll(async () => {
    projectDirectory = createTestProject(app, { tsSolution: true });
    installNxPlugins(projectDirectory, ['@nx/react', '@nx/vite']);
    installPlugin(projectDirectory, 'ionic-react');

    await runNxCommandAsync(
      projectDirectory,
      `generate @nx/react:application ${appRoot} --name=${app} --style=css --bundler=vite --unitTestRunner=vitest --minimal --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`,
    );
    await runNxCommandAsync(
      projectDirectory,
      `generate @nxext/ionic-react:configuration --project=${app} --appName=test --appId=test --skipFormat=true --no-interactive`,
    );
  });

  afterAll(() => {
    cleanupTestProject(projectDirectory);
  });

  it('generates the Ionic React template for the package.json-based project', () => {
    checkFilesExist(
      projectDirectory,
      `${appRoot}/src/App.tsx`,
      `${appRoot}/ionic.config.json`,
    );
  });

  it('registers the project in pnpm-workspace.yaml (TS-solution registration untouched by ionic-react)', () => {
    const workspaceYaml = readFileSync(
      join(projectDirectory, 'pnpm-workspace.yaml'),
      'utf-8',
    );
    expect(workspaceYaml).toContain('packages');
  });

  it('builds the ionic-react-configured app', async () => {
    const result = await runNxCommandAsync(projectDirectory, `build ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target build for project ${app}`,
    );
  });

  it('runs the app unit tests', async () => {
    const result = await runNxCommandAsync(projectDirectory, `test ${app}`);
    expect(stripAnsi(`${result.stdout}${result.stderr}`)).toContain(
      `Successfully ran target test for project ${app}`,
    );
  });

  describe('--capacitor', () => {
    const capApp = uniq('ionic-react-ts-cap');
    const capAppRoot = `packages/${capApp}`;

    beforeAll(async () => {
      await runNxCommandAsync(
        projectDirectory,
        `generate @nx/react:application ${capAppRoot} --name=${capApp} --style=css --bundler=vite --unitTestRunner=vitest --minimal --e2eTestRunner=none --linter=none --skipFormat=true --no-interactive`,
      );
      await runNxCommandAsync(
        projectDirectory,
        `generate @nxext/ionic-react:configuration --project=${capApp} --appName=test --appId=test --capacitor=true --skipFormat=true --no-interactive`,
      );
    });

    it('also configures Capacitor transitively', () => {
      checkFilesExist(projectDirectory, `${capAppRoot}/capacitor.config.ts`);
    });

    it('exposes the cap executor', async () => {
      const help = await runNxCommandAsync(
        projectDirectory,
        `run ${capApp}:cap --cmd="--help"`,
      );
      expect(help.stdout).toContain('Usage: cap');
    });
  });
});
