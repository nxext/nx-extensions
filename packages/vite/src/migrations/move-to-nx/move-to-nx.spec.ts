import { default as update } from './move-to-nx';
import {
  Tree,
  readProjectConfiguration,
  formatFiles
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

describe('move-to-nx', () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' })
    tree.write('apps/app/project.json', `{
  "name": "app",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/app/src",
  "projectType": "application",
  "targets": {
    "build": {
      "executor": "@nxext/vite:build",
      "outputs": ["{options.outputPath}"],
      "defaultConfiguration": "production",
      "options": {
        "outputPath": "dist/apps/app",
        "baseHref": "/",
        "configFile": "@nxext/vite/plugins/vite"
      },
      "configurations": {
        "production": {
          "fileReplacements": [
            {
              "replace": "apps/app/src/environments/environment.ts",
              "with": "apps/app/src/environments/environment.prod.ts"
            }
          ]
        }
      }
    },
    "serve": {
      "executor": "@nxext/vite:dev",
      "options": {
        "outputPath": "dist/apps/app",
        "baseHref": "/",
        "configFile": "@nxext/vite/plugins/vite"
      },
      "configurations": {
        "production": {
          "fileReplacements": [
            {
              "replace": "apps/app/src/environments/environment.ts",
              "with": "apps/app/src/environments/environment.prod.ts"
            }
          ]
        }
      }
    },
    "lint": {
      "executor": "@nrwl/linter:eslint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": ["apps/app/**/*.{ts,js,tsx,jsx}"]
      }
    },
    "test": {
      "executor": "@nxext/vitest:vitest",
      "options": {
        "vitestConfig": "apps/app/vitest.config.ts"
      }
    }
  },
  "tags": []
}`);
    tree.write('apps/app/vitest.config.ts', `
import { mergeConfig } from 'vite';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, {
  plugins: [],
});`);

    await formatFiles(tree);
  });

  it(`should change app targets to vite`, async () => {
    await update(tree);

    const config = readProjectConfiguration(tree, 'app');
    expect(config.targets.build).toEqual({
      executor: '@nxext/vite:build',
      outputs: ['{options.outputPath}'],
      options: {
        frameworkConfigFile: '@nxext/svelte/plugins/vite',
        outputPath: 'dist/apps/app',
        assets: [
          {
            glob: '/*',
            input: './public/**',
            output: './',
          },
        ],
        tsConfig: 'apps/app/tsconfig.app.json',
      },
      configurations: {
        production: {},
      },
    });

    expect(config.targets.serve.executor).toEqual('@nxext/vite:dev');
  });
});
