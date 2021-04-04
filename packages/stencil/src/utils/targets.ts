import { joinPathFragments, TargetConfiguration } from '@nrwl/devkit';
import { LibrarySchema } from '../schematics/library/schema';
import { PWASchema } from '../schematics/ionic-pwa/schema';
import { ApplicationSchema } from '../schematics/application/schema';
import { MakeLibBuildableSchema } from '../schematics/make-lib-buildable/schema';
import { ProjectType } from '@nrwl/workspace';

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
    e2e: getE2eTarget(projectType, options)
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
  return {
    executor: '@nxext/stencil:build',
    options: {
      projectType,
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
      //replaceDependenciesWithLocalPath: true,
    },
    configurations: {
      production: {
        dev: false
        //replaceDependenciesWithLocalPath: false,
      }
    }
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
  return {
    executor: '@nxext/stencil:test',
    options: {
      projectType,
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
    }
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
  return {
    executor: '@nxext/stencil:e2e',
    options: {
      projectType,
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot)
    }
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
  return {
    executor: `@nxext/stencil:build`,
    options: {
      projectType,
      configPath: joinPathFragments(options.projectRoot, 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      serve: true,
      watch: true
    }
  };
}
