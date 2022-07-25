import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('vitest e2e', () => {
  beforeAll(async () => {
    //newProject(['@nxext/vitest']);
    ensureNxProjectAndPrepareDeps('@nxext/vitest', 'dist/packages/vitest', [
      ['@nxext/svelte', 'dist/packages/svelte'],
    ]);
  });

  it('should create vitest', async () => {
    await runNxCommandAsync(`generate @nxext/vitest:init`);

    expect(() => checkFilesExist(`vitest.config.ts`)).not.toThrow();
  }, 120000);

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
});
