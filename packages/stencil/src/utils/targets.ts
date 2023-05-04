import { TargetConfiguration } from '@nx/devkit';
import { LibrarySchema } from '../generators/library/schema';
import { PWASchema } from '../generators/ionic-pwa/schema';
import { ApplicationSchema } from '../generators/application/schema';
import { MakeLibBuildableSchema } from '../generators/make-lib-buildable/schema';
import { ProjectType } from '../utils/typings';

export function getDefaultTargets(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
): { [key: string]: TargetConfiguration } {
  return {
    build: getBuildTarget(projectType, options),
    serve: getServeTarget(projectType, options),
    test: getTestTarget(projectType, options),
    e2e: getE2eTarget(projectType, options),
    lint: getLintTarget(projectType, options.projectRoot),
  };
}

export function getBuildTarget(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:build',
    outputs: ['{options.outputPath}'],
    options: {
      projectType,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
      configPath: `${options.projectRoot}/stencil.config.ts`,
      outputPath: `dist/${options.projectRoot}`,
    },
    configurations: {
      production: {
        dev: false,
        prod: true,
      },
    },
  };
}

export function getTestTarget(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:test',
    outputs: ['{options.outputPath}'],
    options: {
      projectType,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
      configPath: `${options.projectRoot}/stencil.config.ts`,
      outputPath: `dist/${options.projectRoot}`,
    },
  };
}

export function getE2eTarget(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:e2e',
    outputs: ['{options.outputPath}'],
    options: {
      projectType,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
      configPath: `${options.projectRoot}/stencil.config.ts`,
      outputPath: `dist/${options.projectRoot}`,
    },
  };
}

export function getServeTarget(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === 'application' ? 'app' : 'lib';
  return {
    executor: `@nxext/stencil:serve`,
    outputs: ['{options.outputPath}'],
    options: {
      projectType,
      tsConfig: `${options.projectRoot}/tsconfig.${tsconfigAddition}.json`,
      configPath: `${options.projectRoot}/stencil.config.ts`,
      outputPath: `dist/${options.projectRoot}`,
    },
  };
}

export function getLintTarget(
  projectType: ProjectType,
  projectRoot: string
): TargetConfiguration {
  return {
    executor: '@nx/linter:eslint',
    outputs: ['{options.outputFile}'],
    options: {
      lintFilePatterns: `${projectRoot}/**/*.{ts,tsx}`,
    },
  };
}
