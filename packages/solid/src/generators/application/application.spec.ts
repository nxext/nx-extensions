import { Schema } from './schema';
import { Linter } from '@nrwl/linter';
import applicationGenerator from './application';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readJson, readProjectConfiguration, Tree } from '@nrwl/devkit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nrwl/devkit');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readNxVersionModule = require('../init/lib/util');

describe('Solid app', () => {
  let host: Tree;
  const options: Schema = {
    name: 'my-app',
    linter: Linter.EsLint,
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
  };
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());
  jest.spyOn(readNxVersionModule, 'readNxVersion').mockReturnValue('15.7.0');

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
  });

  describe('Vite bundle', () => {
    it('should add vite specific files', async () => {
      await applicationGenerator(host, { ...options });
      expect(host.exists(`apps/${options.name}/index.html`)).toBeTruthy();
    });
  });

  describe('--root-project', () => {
    xit('should create files at the root', async () => {
      await applicationGenerator(host, {
        ...options,
        name: 'my-app2',
        rootProject: true,
      });
      expect(host.read('/src/main.tsx')).toBeDefined();
      expect(host.read('/e2e/cypress.config.ts')).toBeDefined();

      const rootTsConfig = readJson(host, '/tsconfig.json');
      expect(rootTsConfig.extends).toBeUndefined();
      expect(rootTsConfig.compilerOptions.sourceMap).toBe(true);

      expect(
        readJson(host, '/workspace.json').projects['my-app2'].architect['build']
          .options['outputPath']
      ).toEqual('dist/my-app2');
    });
  });

  describe('--unitTestRunner', () => {
    it('jest', async () => {
      await applicationGenerator(host, {
        ...options,
        unitTestRunner: 'jest',
      });
      expect(host.read(`apps/${options.name}/jest.config.ts`)).toBeDefined();

      expect(
        readProjectConfiguration(host, options.name).targets['test'].executor
      ).toEqual('@nrwl/jest:jest');
    });
  });
});
