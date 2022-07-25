import {
  checkFilesExist,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { newProject } from '@nxext/e2e';
import { ensureNxProjectAndPrepareDeps } from '../../utils/testing';

describe('ts.ed e2e', () => {
  beforeAll(() => {
    //newProject(['@nxext/ts.ed']);
    ensureNxProjectAndPrepareDeps('@nxext/ts.ed', 'dist/packages/ts.ed');
  });

  it('should create ts.ed application', async () => {
    const plugin = uniq('ts.ed');
    await runNxCommandAsync(`generate @nxext/ts.ed:app ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain(`webpack compiled`);
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const plugin = uniq('ts.ed');
      await runNxCommandAsync(
        `generate @nxext/ts.ed:app ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const plugin = uniq('ts.ed');
      await runNxCommandAsync(
        `generate @nxext/ts.ed:app ${plugin} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${plugin}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });
});
