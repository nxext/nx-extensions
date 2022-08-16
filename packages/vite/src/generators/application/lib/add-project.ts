import { NormalizedSchema } from '../schema';
import {
  addProjectConfiguration,
  joinPathFragments,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
} from '@nrwl/devkit';

export function addProject(host: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.projectRoot,
    sourceRoot: `${options.projectRoot}/src`,
    projectType: 'application',
    targets: {
      build: createBuildTarget(options),
      serve: createServeTarget(options),
    },
    tags: options.parsedTags,
  };

  addProjectConfiguration(
    host,
    options.projectName,
    {
      ...project,
    },
    options.standaloneConfig
  );
}

function createBuildTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/vite:build',
    outputs: ['{options.outputPath}'],
    defaultConfiguration: 'production',
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      baseHref: '/',
      configFile: '@nxext/vite/plugins/vite',
    },
    configurations: {
      production: {
        fileReplacements: [
          {
            file: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.ts`
            ),
            with: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.prod.ts`
            ),
          },
        ],
      },
    },
  };
}

function createServeTarget(options: NormalizedSchema): TargetConfiguration {
  return {
    executor: '@nxext/vite:dev',
    options: {
      outputPath: joinPathFragments('dist', options.projectRoot),
      baseHref: '/',
      configFile: '@nxext/vite/plugins/vite',
    },
    configurations: {
      production: {
        fileReplacements: [
          {
            file: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.ts`
            ),
            with: joinPathFragments(
              options.projectRoot,
              `src/environments/environment.prod.ts`
            ),
          },
        ],
      },
    },
  };
}
