import { checkFilesExist, runNxCommandAsync } from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('vitest e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/vitest', 'dist/packages/vitest', [
      ['@nxext/svelte', 'dist/packages/svelte'],
      ['@nxext/vite', 'dist/packages/vite'],
    ]);
  });

  it('should create vitest', async () => {
    await runNxCommandAsync(`generate @nxext/vitest:init`);

    expect(() => checkFilesExist(`vitest.config.ts`)).not.toThrow();
  }, 120000);
});
