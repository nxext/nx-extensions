import {
  checkFilesExist,
  cleanup,
  runNxCommand,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { deployedVersion } from '../../e2e/src/utils';

describe('vite migration e2e', () => {
  describe('vite app', () => {
    beforeEach(() => {
      newProject(['@nxext/vite@15.1.0']);
    });

    afterEach(() => {
      // `nx reset` kills the daemon, and performs
      // some work which can help clean up e2e leftovers
      runNxCommand('reset');
      cleanup();
    });

    it('vite application', async () => {
      const plugin = uniq('vite');
      await runNxCommandAsync(`generate @nxext/vite:app ${plugin}`);

      await runNxCommandAsync(`migrate @nxext/vite@${deployedVersion}`);
      await runNxCommandAsync(`migrate --run-migrations`);

      await runNxCommandAsync(`build ${plugin}`);

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });
  });

  describe('vite lib', () => {
    beforeEach(() => {
      newProject(['@nxext/vite@15.1.0']);
    });

    afterEach(() => {
      // `nx reset` kills the daemon, and performs
      // some work which can help clean up e2e leftovers
      runNxCommand('reset');
      cleanup();
    });

    it('vite lib', async () => {
      const plugin = uniq('vitelib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin} --buildable`);

      await runNxCommandAsync(`migrate @nxext/vite@${deployedVersion}`);
      await runNxCommandAsync(`migrate --run-migrations`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });
  });
});
