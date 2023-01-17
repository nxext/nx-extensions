import { cleanup, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
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
    //cleanup();
  });

  it('should create a vue application', async () => {
    const projectName = uniq('vue');
    await runNxCommandAsync(`generate @nxext/vue:app ${projectName} --unitTestRunner='none'`);
    const result = await runNxCommandAsync(`build ${projectName}`);
    expect(result.stdout).toContain(
      `Successfully ran target build for project ${projectName}`
    );
  });

  it('should create a vue application with routing', async () => {
    const projectName = uniq('vuerouting');
    await runNxCommandAsync(`generate @nxext/vue:app ${projectName} --routing --unitTestRunner='none'`);
    const result = await runNxCommandAsync(`build ${projectName}`);
    expect(result.stdout).toContain(
      `Successfully ran target build for project ${projectName}`
    );
  });

  it('should be able to run linter', async () => {
    const projectName = uniq('vuelint');
    await runNxCommandAsync(`generate @nxext/vue:app ${projectName} --routing --unitTestRunner='none'`);
    const result = await runNxCommandAsync(`lint ${projectName}`);
    expect(result.stdout).toContain(
      `All files pass linting.`
    );
  });

  it('should be able to run vitest', async () => {
    const projectName = uniq('vuetest');
    await runNxCommandAsync(`generate @nxext/vue:app ${projectName} --routing --unitTestRunner='vitest'`);
    const result = await runNxCommandAsync(`test ${projectName}`);
    expect(result.stdout).toContain(
      `1 passed`
    );
    expect(result.stdout).toContain(
      `Successfully ran target test for project ${projectName}`
    );
  });
});
