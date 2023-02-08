import {
  runNxCommandAsync,
  uniq,
  checkFilesExist,
  cleanup,
} from '@nrwl/nx-plugin/testing';
import { newProjectWithPreset } from '../../e2e/src/utils/new-project';

describe('vue preset e2e', () => {
  const projectName = uniq('test');

  beforeAll(() => {
    newProjectWithPreset('@nxext/vue', `--vueAppName=${projectName}`);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
    cleanup();
  });

  it('should create a vue application', async () => {
    const result = await runNxCommandAsync(`build ${projectName}`);

    expect(result.stdout).toContain(
      `Successfully ran target build for project ${projectName}`
    );
    checkFilesExist(`apps/${projectName}/src/App.vue`);
  });
});
