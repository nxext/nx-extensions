import { runNxCommandAsync, uniq, updateFile } from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../utils/testing';

describe('tailwind e2e', () => {

  it('should create tailwind for stencil', async (done) => {
    const plugin = uniq('tailwind');

    ensureNxProjectWithDeps('@nxext/tailwind', 'dist/packages/tailwind',
      [['@nxext/stencil', 'dist/packages/stencil']]);

    await runNxCommandAsync(`generate @nxext/stencil:app ${plugin}`);
    await runNxCommandAsync(`generate @nxext/tailwind:stencil ${plugin}`);

    updateFile(`apps/${plugin}/src/global/app.css`, `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
    `);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('build finished');

    done();
  });

  it('should create tailwind for svelte', async (done) => {
    const plugin = uniq('tailwind');

    ensureNxProjectWithDeps('@nxext/tailwind', 'dist/packages/tailwind',
      [['@nxext/svelte', 'dist/packages/svelte']]);

    await runNxCommandAsync(`generate @nxext/svelte:app ${plugin}`);
    await runNxCommandAsync(`generate @nxext/tailwind:svelte ${plugin}`);

    updateFile(`apps/${plugin}/public/global.css`, `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
    `);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Bundle complete');

    done();
  });
});
