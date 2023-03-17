import { default as migration } from './move-to-nx';
import {
  Tree,
  readProjectConfiguration,
  formatFiles,
  logger,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utilsModule = require('./utils');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const devkit = require('@nx/devkit');

describe('move-to-nx', () => {
  jest.spyOn(utilsModule, 'readNxVersion').mockReturnValue('16.0.0');
  jest.spyOn(devkit, 'ensurePackage').mockReturnValue(Promise.resolve());

  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: 'apps-libs' });

    tree.write(
      'apps/app/project.json',
      `{
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
    "test": {
      "executor": "@nxext/vitest:vitest",
      "options": {
        "vitestConfig": "apps/app/vitest.config.ts"
      }
    }
  },
  "tags": []
}`
    );
    tree.write(
      'apps/app/vitest.config.ts',
      `
import { mergeConfig } from 'vite';
import baseConfig from '../../vitest.config';

export default mergeConfig(baseConfig, {
  plugins: [],
});`
    );

    tree.write(
      'libs/lib/project.json',
      `
{
  "name": "lib",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/lib/src",
  "projectType": "library",
  "tags": [],
  "targets": {
    "build": {
      "executor": "@nxext/vite:package",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/lib",
        "packageJson": "package.json",
        "assets": ["assets"],
        "entryFile": "src/index.ts",
        "configFile": "@nxext/vite/plugins/vite-package"
      }
    },
    "test": {
      "executor": "@nxext/vitest:vitest",
      "options": {
        "vitestConfig": "libs/lib2/vitest.config.ts"
      }
    }
  }
}`
    );

    await formatFiles(tree);
  });

  it(`should change app targets to @nrwl/vite`, async () => {
    await migration(tree);

    const appProjectConfig = readProjectConfiguration(tree, 'app');
    expect(appProjectConfig.targets.build.executor).toEqual('@nrwl/vite:build');
    expect(appProjectConfig.targets.serve.executor).toEqual(
      '@nrwl/vite:dev-server'
    );

    for (const [key, config] of Object.entries(appProjectConfig.targets)) {
      expect(config.executor).not.toContain('@nxext');
    }

    logger.info(tree.read('apps/app/project.json', 'utf-8'));

    const libProjectConfig = readProjectConfiguration(tree, 'lib');
    expect(libProjectConfig.targets.build.executor).toEqual('@nrwl/vite:build');
  });
});
