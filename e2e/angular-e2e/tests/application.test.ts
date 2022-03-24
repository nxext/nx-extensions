import { runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('angular application e2e', () => {
  beforeAll(async () => {
    ensureNxProjectAndPrepareDeps(
      '@nxext/angular',
      'dist/packages/angular/nx',
      {
        '@nxext/vite': 'dist/packages/vite',
        '@nxext/angular-swc': 'dist/packages/angular/swc',
        '@nxext/angular-vite': 'dist/packages/angular/vite',
      }
    );
  });

  xit('should create angular application', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:app ${plugin}`);

    const result = await runNxCommandAsync(
      `build ${plugin} --style=css --routing=false`
    );
    expect(result.stdout).toContain('Bundle complete');
  }, 120000);
});
