import { NormalizedSchema } from '../../schema';
import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

function createViteTargets(options: NormalizedSchema): {
  [key: string]: TargetConfiguration;
} {
  return {
    build: createBuildTarget(options),
    serve: createServeTarget(options),
    lint: createLintTarget(options),
  };
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.appProjectRoot),
      frameworkConfigFile: '@nxext/solid/plugins/vite',
    },
    configurations: {
      production: {},
    },
  };
}

function createServeTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/vite:dev',
    options: {
      outputPath: joinPathFragments('dist', options.appProjectRoot),
      frameworkConfigFile: '@nxext/solid/plugins/vite',
    },
  };
}

function createLintTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nrwl/linter:lint',
    options: {
      linter: 'eslint',
      tsConfig: joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
      exclude: [
        '**/node_modules/**',
        `!${joinPathFragments(options.appProjectRoot, '**/*')}`,
      ],
    },
  };
}
