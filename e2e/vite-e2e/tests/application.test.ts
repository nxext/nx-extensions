import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  updateFile,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('vite e2e', () => {
  beforeAll(() => {
    newProject(['@nxext/vite']);
    //ensureNxProjectAndPrepareDeps('@nxext/vite', 'dist/packages/vite');
  });

  describe('vite app', () => {
    it('should build vite application', async () => {
      const plugin = uniq('vite');
      await runNxCommandAsync(`generate @nxext/vite:app ${plugin}`);

      const result = await runNxCommandAsync(`build ${plugin}`);
      expect(result.stdout).toContain('Bundle complete');

      expect(() =>
        checkFilesExist(`dist/apps/${plugin}/index.html`)
      ).not.toThrow();
    });

    it('should add tags to project', async () => {
      const plugin = uniq('vitetags');
      await runNxCommandAsync(
        `generate @nxext/vite:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    });

    it('should generate app into directory', async () => {
      await runNxCommandAsync(`generate @nxext/vite:app project/ui`);
      expect(() =>
        checkFilesExist(`apps/project/ui/src/main.ts`)
      ).not.toThrow();
    });

    it('should be able to run linter', async () => {
      const plugin = uniq('vitelint');
      await runNxCommandAsync(`generate @nxext/vite:app ${plugin}`);

      const result = await runNxCommandAsync(`lint ${plugin}`);
      expect(result.stdout).toContain('All files pass linting');
    });

    it('should be able to build app with dependencies', async () => {
      const appName = uniq('app');
      await runNxCommandAsync(`generate @nxext/vite:app ${appName}`);

      const libName = uniq('lib');
      await runNxCommandAsync(`generate @nxext/vite:lib ${libName}`);

      updateFile(
        `apps/${appName}/src/main.ts`,
        `
import './style.css';
import { testFun } from '@proj/${libName}';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = \`
  <h1>Hello Vite! \$\{testFun\}</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
\`;
      `
      );
      updateFile(
        `libs/${libName}/src/index.ts`,
        `
export function testFun() {
  return 'test';
}
      `
      );

      const result = await runNxCommandAsync(`build ${appName}`);
      expect(result.stdout).toContain('Bundle complete');
    });
  });
});
