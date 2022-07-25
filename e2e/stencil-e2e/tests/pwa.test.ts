import { runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('pwa e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/stencil']);
    ensureNxProjectAndPrepareDeps('@nxext/stencil', 'dist/packages/stencil');
  });

  it(`should build pwa app with scss`, async () => {
    const plugin = uniq('pwa');
    await runNxCommandAsync(
      `generate @nxext/stencil:pwa ${plugin} --style='scss' --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(`build ${plugin} --dev`);
    expect(result.stdout).toContain('build finished');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
});
