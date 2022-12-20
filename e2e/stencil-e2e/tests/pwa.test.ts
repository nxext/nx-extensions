import { cleanup, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('pwa e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/stencil']);
  });

  afterAll(() => cleanup());

  it(`should build pwa app with scss`, async () => {
    const plugin = uniq('pwa');
    await runNxCommandAsync(
      `generate @nxext/stencil:pwa ${plugin} --style='scss' --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(`build ${plugin} --dev`);
    expect(result.stdout).toContain('build finished');
  });
});
