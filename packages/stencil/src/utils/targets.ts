import {
  joinPathFragments,
  ProjectConfiguration,
  TargetConfiguration,
} from '@nrwl/devkit';
import { LibrarySchema } from '../schematics/library/schema';
import { PWASchema } from '../schematics/ionic-pwa/schema';
import { ApplicationSchema } from '../schematics/application/schema';
import { MakeLibBuildableSchema } from '../schematics/make-lib-buildable/schema';
import { ProjectType } from '@nrwl/workspace';

export function addBuildTarget(
  project: ProjectConfiguration,
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  const buildTarget: TargetConfiguration = {
    executor: '@nxext/stencil:build',
    options: {
      projectType,
      configPath: joinPathFragments('dist', 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      //replaceDependenciesWithLocalPath: true,
    },
    configurations: {
      production: {
        dev: false,
        //replaceDependenciesWithLocalPath: false,
      },
    },
  };

  return {
    ...project,
    targets: {
      ...project.targets,
      build: buildTarget,
    },
  };
}

export function addServeTarget(
  project: ProjectConfiguration,
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  const serveTarget: TargetConfiguration = {
    executor: `@nxext/stencil:build`,
    options: {
      projectType,
      configPath: joinPathFragments('dist', 'stencil.config.ts'),
      outputPath: joinPathFragments('dist', options.projectRoot),
      serve: true,
      watch: true,
    },
  };

  return {
    ...project,
    targets: {
      ...project.targets,
      serve: serveTarget,
    },
  };
}
