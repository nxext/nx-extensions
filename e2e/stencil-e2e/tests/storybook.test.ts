import {
  cleanup,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';
import { runNxCommandUntil } from '../../e2e/src/utils/run-commands';

xdescribe('storybook e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/stencil'], ['@nrwl/storybook']);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommand('reset');
    cleanup();
  });

  it('should build', async () => {
    const plugin = uniq('build-storybook');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:storybook-configuration ${plugin} --configureCypress=false`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:component test-comp --project=${plugin}`
    );
    await runNxCommandAsync(`build ${plugin}`);

    const result = await runNxCommandAsync(`build-storybook ${plugin}`);
    expect(result.stdout).toContain('Storybook builder finished ...');
  }, 200000);

  it('should serve', async () => {
    const plugin = uniq('storybook');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:storybook-configuration ${plugin} --configureCypress=false`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:component test-comp --project=${plugin}`
    );

    await runNxCommandUntil(`storybook ${plugin}`, (output) => {
      return /Storybook.*started/gi.test(output);
    });
  }, 200000);
});
