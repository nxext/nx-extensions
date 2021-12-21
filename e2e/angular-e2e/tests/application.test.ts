import {
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('angular application e2e', () => {

  beforeAll(async () => {
    ensureNxProjectWithDeps('@nxext/angular', 'dist/packages/angular', [
      ['@nxext/vite', 'dist/packages/vite']
    ]);
  });


  xit('should create angular application', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');
  }, 120000);
});
