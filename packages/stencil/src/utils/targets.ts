import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';
import { NormalizedLibrarySchema } from '../generators/library/schema';
import { PWASchema } from '../generators/ionic-pwa/schema';
import { ApplicationSchema } from '../generators/application/schema';
import { NormalizedMakeLibBuildableSchema } from '../generators/make-lib-buildable/schema';
import { ProjectType } from '@nrwl/workspace';

export function getDefaultTargets(
  projectType: ProjectType,
  options:
    | NormalizedLibrarySchema
    | PWASchema
    | ApplicationSchema
    | NormalizedMakeLibBuildableSchema
): { [key: string]: TargetConfiguration } {
  return {
    build: getBuildTarget(projectType, options),
    serve: getServeTarget(projectType, options),
    test: getTestTarget(projectType, options),
    e2e: getE2eTarget(projectType, options)
  };
}

export function getBuildTarget(
  projectType: ProjectType,
  options:
    | NormalizedLibrarySchema
    | PWASchema
    | ApplicationSchema
    | NormalizedMakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === ProjectType.Application ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:build',
    options: {
      projectType,
      tsConfig: joinPathFragments(options.projectRoot, `tsconfig.${tsconfigAddition}.json`),
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
    },
    outputs: [
      '{options.outputPath}'
    ],
    configurations: {
      production: {
        dev: false
      }
    }
  };
}

export function getTestTarget(
  projectType: ProjectType,
  options:
    | NormalizedLibrarySchema
    | PWASchema
    | ApplicationSchema
    | NormalizedMakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === ProjectType.Application ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:test',
    options: {
      projectType,
      tsConfig: joinPathFragments(options.projectRoot, `tsconfig.${tsconfigAddition}.json`),
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
    },
    outputs: [
      '{options.outputPath}'
    ],
  };
}

export function getE2eTarget(
  projectType: ProjectType,
  options:
    | NormalizedLibrarySchema
    | PWASchema
    | ApplicationSchema
    | NormalizedMakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === ProjectType.Application ? 'app' : 'lib';
  return {
    executor: '@nxext/stencil:e2e',
    options: {
      projectType,
      tsConfig: joinPathFragments(options.projectRoot, `tsconfig.${tsconfigAddition}.json`),
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
    },
    outputs: [
      '{options.outputPath}'
    ],
  };
}

export function getServeTarget(
  projectType: ProjectType,
  options:
    | NormalizedLibrarySchema
    | PWASchema
    | ApplicationSchema
    | NormalizedMakeLibBuildableSchema
): TargetConfiguration {
  const tsconfigAddition = projectType === ProjectType.Application ? 'app' : 'lib';
  return {
    executor: `@nxext/stencil:build`,
    options: {
      projectType,
      tsConfig: joinPathFragments(options.projectRoot, `tsconfig.${tsconfigAddition}.json`),
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      serve: true,
      watch: true
    },
    outputs: [
      '{options.outputPath}'
    ],
  };
}
