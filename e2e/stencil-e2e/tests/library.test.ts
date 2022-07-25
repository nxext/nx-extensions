import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('library e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/stencil']);
    ensureNxProjectAndPrepareDeps('@nxext/stencil', 'dist/packages/stencil');
  });

  it(`should build app with scss`, async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='scss' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(`build ${plugin} --dev`);
    expect(result.stdout).toContain('build finished');
  });

  it('should be able to make a lib buildable', async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:make-lib-buildable ${plugin} --importPath=@my/lib`
    );

    const result = await runNxCommandAsync(`build ${plugin} --dev`);
    expect(result.stdout).toContain('build finished');

    expect(() =>
      checkFilesExist(`libs/${plugin}/stencil.config.ts`)
    ).not.toThrow();
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
});
