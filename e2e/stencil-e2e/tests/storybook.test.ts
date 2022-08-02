import {
  ensureNxProject,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '../../e2e/src';

describe('storybook e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/stencil'], ['@nrwl/storybook']);
  });

  it('should build', async () => {
    const plugin = uniq('lib');
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
});
