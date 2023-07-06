import { checkFilesExist, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import { createTestProject, installPlugin } from '@nxext/e2e-utils';
import { rmSync } from 'fs';

xdescribe('vue e2e', () => {
  const projectName = uniq('presetappstandalone');
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();
    installPlugin(projectDirectory, 'vue');
  });

  afterAll(() => {
    // Cleanup the test project
    rmSync(projectDirectory, {
      recursive: true,
      force: true,
    });
  });

  describe('preset', () => {
    it('should create a vue application', async () => {
      const result = await runNxCommandAsync(`build ${projectName}`);

      checkFilesExist(`src/main.ts`);
      expect(result.stdout).toContain(
        `Successfully ran target build for project ${projectName}`
      );
    });
  });
});
