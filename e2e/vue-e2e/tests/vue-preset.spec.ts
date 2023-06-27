import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
  updateFile,
} from '@nx/plugin/testing';
import { newProject } from '../../e2e/src';
import { names } from '@nx/devkit';
import { newProjectWithPreset } from '../../e2e/src/utils/new-project';

xdescribe('vue e2e', () => {
  const projectName = uniq('presetapp');

  beforeAll(() => {
    newProjectWithPreset('@nxext/vue', `--vueAppName=${projectName}`);
  });

  afterEach(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  describe('preset', () => {
    it('should create a vue application', async () => {
      const result = await runNxCommandAsync(`build ${projectName}`);

      checkFilesExist(`apps/${projectName}/src/main.ts`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });
  });
});
