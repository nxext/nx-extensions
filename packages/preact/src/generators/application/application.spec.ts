import { PreactApplicationSchema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { updateJson, Tree } from '@nrwl/devkit';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nrwl/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../utils/utils');

describe('Preact app schematic', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

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
        '@nrwl/workspace': '15.7.0',
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
