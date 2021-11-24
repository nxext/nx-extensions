import { NormalizedSchema } from '../../schema';
import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';

export function createViteTargets(options: NormalizedSchema): {
  [key: string]: TargetConfiguration;
} {
  return {
    build: createBuildTarget(options),
    serve: createServeTarget(options),
    lint: createLintTarget(options),
    test: createTestTarget(options),
  };
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
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
      outputPath: joinPathFragments('dist', options.projectRoot),
      jestConfig: joinPathFragments(options.projectRoot, 'jest.config.js'),
      passWithNoTests: true,
    },
  };
}
