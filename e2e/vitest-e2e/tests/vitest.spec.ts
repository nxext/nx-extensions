import { checkFilesExist } from '@nrwl/nx-plugin/testing';
import { newProject, runCLI } from '@nxext/e2e';

describe('vitest e2e', () => {
  beforeAll(async () => {
    newProject(['@nxext/vitest']);
  });

  it('should create vitest', async () => {
    runCLI(`generate @nxext/vitest:init`);

    expect(() => checkFilesExist(`vitest.config.ts`)).not.toThrow();
  }, 120000);
});
