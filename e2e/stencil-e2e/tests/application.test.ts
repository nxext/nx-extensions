import {
  checkFilesExist,
  cleanup,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('application e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/stencil']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
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

  it(`should build app with prerender parameter`, async () => {
    const plugin = uniq('app-prerender');
    await runNxCommandAsync(
      `generate @nxext/stencil:app ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
    );

    const result = await runNxCommandAsync(`build ${plugin} --prerender=true`);
    expect(result.stdout).toContain('build finished');
    expect(() => {
      checkFilesExist(
        `dist/apps/${plugin}/www/index.html`,
        `dist/apps/${plugin}/www/host.config.json`
      );
    }).not.toThrow();
  });
});
