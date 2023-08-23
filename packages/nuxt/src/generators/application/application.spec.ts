import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';
import { applicationGenerator } from './application';
import { Schema } from './schema';
import { Linter } from '@nx/linter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('app generator', () => {
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let host: Tree;
  const projectName = 'my-app';
  const options: Schema = {
    name: projectName,
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    e2eTestRunner: 'none',
  };

  beforeEach(() => {
    host = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });
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

    expect(host.exists('apps/my-app/nuxt.config.ts')).toBeTruthy();
    expect(host.exists('apps/my-app/nuxt.d.ts')).toBeTruthy();
    expect(host.exists('apps/my-app/src/pages/index.vue')).toBeTruthy();

    const tsconfig = readJson(host, 'apps/my-app/tsconfig.json');
    expect(tsconfig.compilerOptions.allowJs).toEqual(true);
    expect(tsconfig.compilerOptions.outDir).toEqual('../../dist/out-tsc');
    const tsconfigApp = readJson(host, 'apps/my-app/tsconfig.app.json');
    expect(tsconfigApp.extends).toEqual('./tsconfig.json');
    expect(tsconfigApp.exclude).toEqual(['./**/*.spec.ts', './**/*.test.ts']);

    const eslintJson = readJson(host, 'apps/my-app/.eslintrc.json');
    expect(eslintJson.extends).toEqual([
      'eslint:recommended',
      '@nuxtjs/eslint-config-typescript',
      'plugin:vue/vue3-essential',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting',
      '../../.eslintrc.json',
    ]);
  });

  it('should generate files in root', async () => {
    await applicationGenerator(host, { ...options, rootProject: true });

    expect(host.exists('/nuxt.config.ts')).toBeTruthy();
    expect(host.exists('/nuxt.d.ts')).toBeTruthy();
    expect(host.exists('/src/pages/index.vue')).toBeTruthy();

    const tsconfig = readJson(host, 'tsconfig.json');
    expect(tsconfig.compilerOptions.allowJs).toEqual(true);
    expect(tsconfig.compilerOptions.outDir).toEqual('./dist/out-tsc');
    const tsconfigApp = readJson(host, './tsconfig.app.json');
    expect(tsconfigApp.extends).toEqual('./tsconfig.json');
    expect(tsconfigApp.exclude).toEqual(['./**/*.spec.ts', './**/*.test.ts']);

    const eslintJson = readJson(host, '.eslintrc.json');
    expect(eslintJson.extends).toEqual([
      'eslint:recommended',
      '@nuxtjs/eslint-config-typescript',
      'plugin:vue/vue3-essential',
      '@vue/eslint-config-typescript',
      '@vue/eslint-config-prettier/skip-formatting',
      './.eslintrc.json',
    ]);
  });

  describe('e2e', () => {
    describe('cypress', () => {
      it('integrated - should generate files', async () => {
        await applicationGenerator(host, {
          ...options,
          e2eTestRunner: 'cypress',
        });

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
      it('standalone - should generate files', async () => {
        await applicationGenerator(host, {
          ...options,
          rootProject: true,
          e2eTestRunner: 'cypress',
        });

        expect(host.exists('e2e/cypress.config.ts')).toBeTruthy();
        const tsconfigE2E = readJson(host, 'e2e/tsconfig.json');
        expect(tsconfigE2E).toMatchInlineSnapshot(`
        Object {
          "compilerOptions": Object {
            "allowJs": true,
            "outDir": "../dist/out-tsc",
            "sourceMap": false,
            "types": Array [
              "cypress",
              "node",
            ],
          },
          "extends": "../tsconfig.base.json",
          "include": Array [
            "src/**/*.ts",
            "src/**/*.js",
            "cypress.config.ts",
          ],
        }
      `);
      });
    });

    describe('playwright', () => {
      it('integrated - should generate files', async () => {
        await applicationGenerator(host, {
          ...options,
          e2eTestRunner: 'playwright',
        });

        expect(
          host.exists('apps/my-app-e2e/playwright.config.ts')
        ).toBeTruthy();
      });
      it('standalone - should generate files', async () => {
        await applicationGenerator(host, {
          ...options,
          rootProject: true,
          e2eTestRunner: 'playwright',
        });

        expect(host.exists('e2e/playwright.config.ts')).toBeTruthy();
      });
    });
  });
});
