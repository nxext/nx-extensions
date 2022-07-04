import { runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('angular library e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/angular']);
    ensureNxProjectAndPrepareDeps('@nxext/angular', 'dist/packages/angular');
  });

  xit('should create angular library', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:lib ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Bundle complete');
  }, 120000);
});
