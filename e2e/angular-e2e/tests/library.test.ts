import {
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('angular library e2e', () => {
  beforeAll(async () => {
    ensureNxProjectWithDeps('@nxext/angular', 'dist/packages/angular/nx', [
      ['@nxext/vite', 'dist/packages/vite'],
      ['@nxext/angular-vite', 'dist/packages/angular/vite'],
      ['@nxext/angular-swc', 'dist/packages/angular/swc'],
    ]);
  });

  xit('should create angular library', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:lib ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Bundle complete');
  }, 120000);
});
