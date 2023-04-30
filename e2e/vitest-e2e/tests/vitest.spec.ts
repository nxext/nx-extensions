import {
  checkFilesExist,
  runNxCommandAsync,
  cleanup,
  runNxCommand,
} from '@nx/plugin/testing';
import { newProject } from '@nxext/e2e';

xdescribe('vitest e2e', () => {
  beforeAll(async () => {
    newProject(['@nxext/vitest']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  it('should create vitest', async () => {
    await runNxCommandAsync(`generate @nxext/vitest:init`);

    expect(() => checkFilesExist(`vitest.config.ts`)).not.toThrow();
  }, 120000);
});
