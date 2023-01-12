import {
  checkFilesExist,
  cleanup,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('vue e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    newProject(['@nxext/vue']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
    cleanup();
  });

  it('should create vue', async () => {
    const project = uniq('vue');
    await runNxCommandAsync(`generate @nxext/vue:vue ${project}`);
    const result = await runNxCommandAsync(`build ${project}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('vue');
      await runNxCommandAsync(
        `generate @nxext/vue:vue ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`libs/subdir/${project}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('vue');
      ensureNxProject('@nxext/vue', 'dist/packages/vue');
      await runNxCommandAsync(
        `generate @nxext/vue:vue ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`libs/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
