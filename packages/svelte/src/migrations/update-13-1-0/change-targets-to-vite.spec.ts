import { default as update } from './change-targets-to-vite';
import {
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { createTestProject } from '../../generators/utils/testing';

describe('change-targets-to-vite', () => {
  let tree;

  beforeEach(async () => {
    tree = await createTestProject('app', 'application');
    tree = await createTestProject('lib', 'library', tree);

    const appconfig = readProjectConfiguration(tree, 'app');
    appconfig.targets = {
      build: {
        executor: '@nxext/svelte:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: 'dist/apps/app',
          entryFile: 'apps/app/src/main.ts',
          tsConfig: 'apps/app/tsconfig.app.json',
          svelteConfig: 'apps/app/svelte.config.cjs',
          assets: [
            {
              glob: '/*',
              input: 'apps/app/public/**',
              output: './',
            },
          ],
        },
      },
      serve: {
        executor: '@nxext/svelte:build',
        options: {
          outputPath: 'dist/apps/app',
          entryFile: 'apps/app/src/main.ts',
          tsConfig: 'apps/app/tsconfig.app.json',
          svelteConfig: 'apps/app/svelte.config.cjs',
          assets: [
            {
              glob: '/*',
              input: 'apps/app/public/**',
              output: './',
            },
          ],
          watch: true,
          serve: true,
        },
      },
    };
    updateProjectConfiguration(tree, 'app', appconfig);

    const libconfig = readProjectConfiguration(tree, 'lib');
    libconfig.targets = {
      build: {
        executor: '@nxext/svelte:build',
        outputs: ['{options.outputPath}'],
        options: {
          outputPath: 'dist/libs/lib',
          entryFile: 'libs/lib/src/main.ts',
          tsConfig: 'libs/lib/tsconfig.lib.json',
          svelteConfig: 'libs/lib/svelte.config.cjs',
          assets: [
            {
              glob: '/*',
              input: 'libs/lib/public/**',
              output: './',
            },
          ],
        },
      },
      serve: {
        executor: '@nxext/svelte:serve',
        options: {
          outputPath: 'dist/libs/lib',
          entryFile: 'libs/lib/src/main.ts',
          tsConfig: 'libs/lib/tsconfig.app.json',
          svelteConfig: 'apps/app/svelte.config.cjs',
          assets: [
            {
              glob: '/*',
              input: 'libs/lib/public/**',
              output: './',
            },
          ],
          watch: true,
          serve: true,
        },
      },
    };
    updateProjectConfiguration(tree, 'lib', libconfig);
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

  it(`should change lib targets to vite`, async () => {
    await update(tree);

    const config = readProjectConfiguration(tree, 'lib');
    expect(config.targets.build).toEqual({
      executor: '@nxext/vite:package',
      outputs: ['{options.outputPath}'],
      options: {
        entryFile: `src/index.ts`,
        frameworkConfigFile: '@nxext/svelte/plugins/vite',
        outputPath: 'dist/libs/lib',
        assets: [{ glob: '/*', input: './public/**', output: './' }],
        tsConfig: 'libs/lib/tsconfig.lib.json',
      },
      configurations: {
        production: {},
      },
    });
    expect(config.targets.serve.executor).toEqual('@nxext/vite:dev');
  });
});
