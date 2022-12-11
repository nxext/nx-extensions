import { runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { cleanupProject, newProject } from '@nxext/e2e';

xdescribe('angular application e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/angular']);
  });

  afterAll(() => cleanupProject());

  xit('should create angular application', async () => {
    const plugin = uniq('angular');
    await runNxCommandAsync(`generate @nxext/angular:app ${plugin}`);

    const result = await runNxCommandAsync(
      `build ${plugin} --style=css --routing=false`
    );
    expect(result.stdout).toContain('Bundle complete');
  }, 120000);
});
