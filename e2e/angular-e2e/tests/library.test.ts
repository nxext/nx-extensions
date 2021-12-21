import {
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('angular library e2e', () => {

  beforeAll(async () => {
    ensureNxProjectWithDeps('@nxext/angular', 'dist/packages/angular', [
      ['@nxext/vite', 'dist/packages/vite']
    ]);
  });


  it('should create angular library', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:lib ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);
});
