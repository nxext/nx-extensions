import { PreactApplicationSchema } from './schema';
import { Linter } from '@nx/eslint';
import { applicationGenerator } from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

describe('Preact app schematic', () => {
  let host: Tree;
  const options: PreactApplicationSchema = {
    directory: 'apps/test',
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
      expect(host.exists(`apps/test/public/index.html`)).toBeFalsy();
      expect(host.exists(`apps/test/index.html`)).toBeTruthy();
    });
  });
});
