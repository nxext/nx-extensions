import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('application e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/stencil']);
    ensureNxProjectAndPrepareDeps('@nxext/stencil', 'dist/packages/stencil');
  });

  it(`should build app with css`, async () => {
    const plugin = uniq('app2');
    await runNxCommandAsync(
      `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(`build ${plugin} --dev`);
    expect(result.stdout).toContain('build finished');
    expect(() => {
      checkFilesExist(
        `dist/apps/${plugin}/www/index.html`,
        `dist/apps/${plugin}/www/host.config.json`
      );
    }).not.toThrow();
  });
});
