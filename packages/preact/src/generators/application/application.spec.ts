import { PreactApplicationSchema } from './schema';
import { Linter } from '@nx/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

describe('Preact app schematic', () => {
  let host: Tree;
  const options: PreactApplicationSchema = {
    name: 'test',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(host, { ...options });
      expect(host.exists(`apps/${options.name}/public/index.html`)).toBeFalsy();
      expect(host.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
