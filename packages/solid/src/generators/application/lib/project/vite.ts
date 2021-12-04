import { NormalizedSchema } from '../../schema';
import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

export function createViteTargets(options: NormalizedSchema): {
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
      outputPath: joinPathFragments('dist', options.projectRoot),
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
      outputPath: joinPathFragments('dist', options.projectRoot),
      frameworkConfigFile: '@nxext/solid/plugins/vite',
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
