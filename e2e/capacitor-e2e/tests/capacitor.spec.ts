import {
  readFile,
  runNxCommandAsync,
  runPackageManagerInstall,
  uniq,
  updateFile,
} from '@nrwl/nx-plugin/testing';
import { CapacitorGeneratorSchema } from '@nxext/capacitor';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

const asyncTimeout = 600_000;

const defaultCapacitorProjectOptions: CapacitorGeneratorSchema = {
  project: 'test-app',
  appId: 'test-id',
  skipFormat: true,
};

async function generateApp(options: CapacitorGeneratorSchema) {
  const packageJson = JSON.parse(readFile('package.json'));
  packageJson.devDependencies['@nrwl/react'] = '*';
  updateFile('package.json', JSON.stringify(packageJson));
  runPackageManagerInstall();

  await runNxCommandAsync(`generate @nrwl/react:app ${options.project}`);
  await runNxCommandAsync(
    `generate @nxext/capacitor:capacitor-project --project ${options.project}`
  );
}

async function buildAndTestApp(plugin: string) {
  const buildResults = await runNxCommandAsync(`build ${plugin}`);
  expect(buildResults.stdout).toContain('compiled');

  const lintResults = await runNxCommandAsync(`lint ${plugin}`);
  expect(lintResults.stdout).toContain('All files pass linting');

  const testResults = await runNxCommandAsync(`test ${plugin}`);
  expect(testResults.stderr).toContain('Ran all test suites');

  const e2eResults = await runNxCommandAsync(`e2e ${plugin}-e2e --headless`);
  expect(e2eResults.stdout).toContain('All specs passed!');

  const capResults = await runNxCommandAsync(`run ${plugin}:cap`);
  expect(capResults.stdout).toContain('Usage');

  const capPackageInstallResults = await runNxCommandAsync(
    `run ${plugin}:cap --packageInstall false`
  );
  expect(capPackageInstallResults.stdout).toContain('Usage: cap');

  const capHelpResults = await runNxCommandAsync(
    `run ${plugin}:cap --cmd="--help"`
  );
  expect(capHelpResults.stdout).toContain('Usage: cap');
}

describe('capacitor-project e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/capacitor']);
    ensureNxProjectAndPrepareDeps(
      '@nxext/capacitor',
      'dist/packages/capacitor'
    );
  });

  it(
    'should build and test successfully',
    async () => {
      const plugin = uniq('capacitor');
      const options: CapacitorGeneratorSchema = {
        ...defaultCapacitorProjectOptions,
        project: plugin,
      };

      await generateApp(options);
      await buildAndTestApp(plugin);
    },
    asyncTimeout
  );
});
