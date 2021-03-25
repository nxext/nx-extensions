import { NormalizedSchema } from '../../schema';
import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

export function createRollupTargets(options: NormalizedSchema): { [key: string]: TargetConfiguration } {
  return {
    build: createBuildTarget(options),
    serve: createServeTarget(options),
    lint: createLintTarget(options),
    check: createSvelteCheckTarget(options),
  };
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/svelte:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      entryFile: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      svelteConfig: joinPathFragments(options.projectRoot, 'svelte.config.cjs'),
      assets: [
        {
          glob: '/*',
          input: joinPathFragments(options.projectRoot, 'public/**'),
          output: './',
        },
      ],
    },
    configurations: {
      production: {
        dev: false,
      },
    },
  };
}

function createSvelteCheckTarget(
  options: NormalizedSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/workspace:run-commands',
    options: {
      command: 'svelte-check',
      cwd: options.projectRoot,
    },
  };
}

function createServeTarget(options: NormalizedSchema): TargetConfiguration {
  let serverOptions: {
    // Ignore
  };
  if (options.port !== 5000) {
    serverOptions = { port: options.port };
  }
  if (options.host !== 'localhost') {
    serverOptions = {
      ...serverOptions,
      ...{ host: options.host },
    };
  }

  return {
    executor: '@nxext/svelte:build',
    options: {
      ...{
        outputPath: joinPathFragments('dist', options.projectRoot),
        entryFile: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
        tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
        svelteConfig: joinPathFragments(
          options.projectRoot,
          'svelte.config.cjs'
        ),
        assets: [
          {
            glob: '/*',
            input: joinPathFragments(options.projectRoot, 'public/**'),
            output: './',
          },
        ],
        watch: true,
        serve: true,
      },
      ...serverOptions,
    },
  };
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.projectRoot, '**/*')}`,
      ],
    },
  };
}

function createTestTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: joinPathFragments(options.projectRoot, 'jest.config.js'),
      passWithNoTests: true,
    },
  };
}
