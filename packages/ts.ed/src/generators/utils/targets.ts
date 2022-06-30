import { joinPathFragments, TargetConfiguration } from '@nxext/devkit';
import { NormalizedSchema as LibrarySchema } from '../library/schema';
import { NormalizedSchema as ApplicationSchema } from '../application/schema';

export function createTargets(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): {
  [key: string]: TargetConfiguration;
} {
  return {
    build: createBuildTarget(projectType, options),
    serve: createServeTarget(projectType, options),
    lint: createLintTarget(options),
    check: createTestTarget(options),
  };
}

export type ProjectType = 'application' | 'library';

export function createPackageTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nrwl/node:execute',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      main: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
    },
    configurations: {
      production: {},
    },
  };
}

export function createBuildTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nrwl/node:webpack',
    outputs: ['{options.outputPath}'],
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      main: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
    },
    configurations: {
      production: {},
    },
  };
}

export function createServeTarget(
  projectType: ProjectType,
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nrwl/node:node',
    options: {
      buildTarget: `${options.name}:build`,
    },
  };
}

export function createLintTarget(
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
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

export function createTestTarget(
  options: LibrarySchema | ApplicationSchema
): TargetConfiguration {
  return {
    executor: '@nrwl/jest:jest',
    options: {
      jestConfig: joinPathFragments(options.projectRoot, 'jest.config.ts'),
      passwithNoTests: true,
    },
  };
}
