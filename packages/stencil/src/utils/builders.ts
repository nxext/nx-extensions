import { ProjectType } from '@nrwl/workspace';
import { LibrarySchema } from '../schematics/library/schema';
import { PWASchema } from '../generators/ionic-pwa/schema';
import { ApplicationSchema } from '../generators/application/schema';
import { MakeLibBuildableSchema } from '../schematics/make-lib-buildable/schema';
import { joinPathFragments } from '@nrwl/devkit';

export function getDefaultBuilders(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  const targets = {};
  targets['build'] = getBuildBuilder(projectType, options);
  targets['test'] = getTestBuilder(projectType, options);
  targets['serve'] = getServeBuilder(projectType, options);
  targets['e2e'] = getE2eBuilder(projectType, options);
}

export function getBuildBuilder(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  return {
    builder: `@nxext/stencil:build`,
    outputs: [
      '{options.outputPath}'
    ],
    options: {
      projectType,
      configPath: joinPathFragments(`${options.projectRoot}/stencil.config.ts`),
      outputPath: joinPathFragments(`dist/${options.projectRoot}`)
    },
    configurations: {
      production: {
        dev: false
      },
    },
  };
}

export function getTestBuilder(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  return {
    builder: `@nxext/stencil:test`,
    outputs: [
      '{options.outputPath}'
    ],
    options: {
      projectType,
      configPath: joinPathFragments(`${options.projectRoot}/stencil.config.ts`),
      outputPath: joinPathFragments(`dist/${options.projectRoot}`)
    }
  };
}

export function getServeBuilder(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  return {
    builder: `@nxext/stencil:build`,
    outputs: [
      '{options.outputPath}'
    ],
    options: {
      projectType,
      configPath: joinPathFragments(`${options.projectRoot}/stencil.config.ts`),
      outputPath: joinPathFragments(`dist/${options.projectRoot}`),
      serve: true,
      watch: true
    }
  };
}

export function getE2eBuilder(
  projectType: ProjectType,
  options:
    | LibrarySchema
    | PWASchema
    | ApplicationSchema
    | MakeLibBuildableSchema
) {
  return {
    builder: `@nxext/stencil:e2e`,
    outputs: [
      '{options.outputPath}'
    ],
    options: {
      projectType,
      configPath: joinPathFragments(`${options.projectRoot}/stencil.config.ts`),
      outputPath: joinPathFragments(`dist/${options.projectRoot}`)
    }
  };
}
