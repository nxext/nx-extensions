import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nrwl/nx-plugin/testing';
import { projectRootDir, ProjectType } from '@nrwl/workspace';

describe('e2e', () => {
  describe('stencil', () => {
    it(`should build dev`, async (done) => {
      ensureNxProject('@nxext/stencil', 'dist/libs/stencil');
      await runNxCommandAsync(`generate @nxext/stencil:lib library --style=scss`);
      
      done();
    });
  });
});
