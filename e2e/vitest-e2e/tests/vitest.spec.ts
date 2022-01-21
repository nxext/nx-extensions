import {
  checkFilesExist,
  uniq,
  runNxCommandAsync,
} from '@nrwl/nx-plugin/testing';
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

  it('should initialice vitest project', async () => {
    const libraryName = uniq('vitest');
    await runNxCommandAsync(`generate @nxext/svelte:lib ${libraryName}`);
    await runNxCommandAsync(
      `generate @nxext/svelte:c my-comp --project=${libraryName}`
    );

    await runNxCommandAsync(
      `generate @nxext/vitest:vitest-project ${libraryName} --framework=svelte`
    );

    const result = await runNxCommandAsync(`test ${libraryName}`);

    expect(`${result.stdout}/${result.stderr}`).toContain('Tests executed...');
  }, 120000);
});
