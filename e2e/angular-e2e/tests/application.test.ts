import { runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

xdescribe('angular application e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/angular']);
    ensureNxProjectAndPrepareDeps('@nxext/angular', 'dist/packages/angular');
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
