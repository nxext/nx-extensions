import { PreactApplicationSchema } from './schema';
import { Linter } from '@nx/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { updateJson, Tree } from '@nx/devkit';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires

describe('Preact app schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

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
        '@nx/workspace': '16.0.0',
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
