import { PreactApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { updateJson, Tree } from '@nrwl/devkit';

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
    updateJson(host, '/package.json', (json) => {
      json.devDependencies = {
        '@nrwl/workspace': '15.6.0',
      };
      return json;
    });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(host, { ...options });
      expect(host.exists(`apps/${options.name}/public/index.html`)).toBeFalsy();
      expect(host.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });
});
