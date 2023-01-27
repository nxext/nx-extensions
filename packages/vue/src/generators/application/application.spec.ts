import { createTreeWithEmptyV1Workspace } from '@nrwl/devkit/testing';
import {
  addDependenciesToPackageJson,
  readJson,
  readProjectConfiguration,
  Tree,
} from '@nrwl/devkit';

import applicationGenerator from './application';
import { Schema } from './schema';
import { Linter } from '@nrwl/linter';

describe('app generator', () => {
  let host: Tree;
  const projectName = 'my-app';
  const options: Schema = {
    name: projectName,
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    e2eTestRunner: 'cypress',
  };

  beforeEach(() => {
    host = createTreeWithEmptyV1Workspace();
    addDependenciesToPackageJson(host, {}, { '@nrwl/workspace': '15.5.0' });
  });

  it('should run successfully', async () => {
    await applicationGenerator(host, options);
    const config = readProjectConfiguration(host, projectName);
    expect(config).toBeDefined();
  });

  it('should extend from root tsconfig.base.json', async () => {
    await applicationGenerator(host, options);

    const tsConfig = readJson(host, 'apps/my-app/tsconfig.json');
    expect(tsConfig.extends).toEqual('../../tsconfig.base.json');
  });

  it('should generate files', async () => {
    await applicationGenerator(host, options);

    expect(host.exists('apps/my-app/vite.config.ts')).toBeTruthy();
    expect(host.exists('apps/my-app/index.html')).toBeTruthy();
    expect(host.exists('apps/my-app/src/App.vue')).toBeTruthy();
    expect(host.exists('apps/my-app/src/main.ts')).toBeTruthy();

    const tsconfig = readJson(host, 'apps/my-app/tsconfig.json');
    expect(tsconfig.references).toEqual([
      {
        path: './tsconfig.app.json',
      },
      {
        path: './tsconfig.spec.json',
      },
    ]);
    expect(tsconfig.compilerOptions.allowJs).toEqual(true);
    const tsconfigApp = readJson(host, 'apps/my-app/tsconfig.app.json');
    expect(tsconfigApp.compilerOptions.outDir).toEqual('../../dist/out-tsc');
    expect(tsconfigApp.extends).toEqual('./tsconfig.json');
    expect(tsconfigApp.exclude).toEqual([
      'jest.config.ts',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
      'src/**/*.spec.tsx',
      'src/**/*.test.tsx',
      'src/**/*.spec.js',
      'src/**/*.test.js',
      'src/**/*.spec.jsx',
      'src/**/*.test.jsx',
    ]);

    const eslintJson = readJson(host, 'apps/my-app/.eslintrc.json');
    expect(eslintJson.extends).toEqual([
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier',
      '../../.eslintrc.json',
    ]);

    expect(host.exists('apps/my-app-e2e/cypress.config.ts')).toBeTruthy();
    const tsconfigE2E = readJson(host, 'apps/my-app-e2e/tsconfig.json');
    expect(tsconfigE2E).toMatchInlineSnapshot(`
        Object {
          "compilerOptions": Object {
            "allowJs": true,
            "outDir": "../../dist/out-tsc",
            "sourceMap": false,
            "types": Array [
              "cypress",
              "node",
            ],
          },
          "extends": "../../tsconfig.base.json",
          "include": Array [
            "src/**/*.ts",
            "src/**/*.js",
            "cypress.config.ts",
          ],
        }
      `);
  });
});
