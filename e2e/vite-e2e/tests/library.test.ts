import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('vite lib e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/vite']);
    //ensureNxProjectAndPrepareDeps('@nxext/vite', 'dist/packages/vite');
  });

  describe('vite lib', () => {
    it('should create vite library', async () => {
      const plugin = uniq('vitelib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin}`);

      expect(() =>
        checkFilesExist(`libs/${plugin}/src/index.ts`)
      ).not.toThrow();
    });

    it('should generate lib into directory', async () => {
      await runNxCommandAsync(`generate @nxext/vite:lib project/uilib`);
      expect(() =>
        checkFilesExist(`libs/project/uilib/src/index.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('viteliblint');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able build lib if buildable', async () => {
      const plugin = uniq('vitelib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${plugin} --buildable`);

      const result = await runNxCommandAsync(`build ${plugin}`);

      expect(() =>
        checkFilesExist(
          `dist/libs/${plugin}/${plugin}.es.js`,
          `dist/libs/${plugin}/${plugin}.umd.js`
        )
      ).not.toThrow();
    });
  });
});
