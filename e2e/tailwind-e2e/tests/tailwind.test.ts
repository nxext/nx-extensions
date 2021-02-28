import { runNxCommandAsync, uniq, updateFile } from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../utils/testing';

describe('tailwind e2e', () => {
  it('should create tailwind', async (done) => {
    const plugin = uniq('tailwind');

    ensureNxProjectWithDeps('@nxext/tailwind', 'dist/packages/tailwind', [
      ['@nxext/stencil', 'dist/packages/stencil'],
    ]);

    await runNxCommandAsync(`generate @nxext/stencil:app ${plugin}`);
    await runNxCommandAsync(`generate @nxext/tailwind:stencil ${plugin}`);

    updateFile(
      `apps/${plugin}/src/global/app.css`,
      `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
    `
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('build finished');

    done();
  });
});
