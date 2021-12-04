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
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}/src`,
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
      outputPath: joinPathFragments('dist', options.appProjectRoot),
      baseHref: '/',
      configFile: '@nxext/vite/plugins/vite',
    },
    configurations: {
      production: {
        fileReplacements: [
          {
            replace: joinPathFragments(
              options.appProjectRoot,
              `src/environments/environment.ts`
            ),
            with: joinPathFragments(
              options.appProjectRoot,
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
      outputPath: joinPathFragments('dist', options.appProjectRoot),
      baseHref: '/',
      configFile: '@nxext/vite/plugins/vite',
    },
    configurations: {
      production: {
        fileReplacements: [
          {
            replace: joinPathFragments(
              options.appProjectRoot,
              `src/environments/environment.ts`
            ),
            with: joinPathFragments(
              options.appProjectRoot,
              `src/environments/environment.prod.ts`
            ),
          },
        ],
      },
    },
  };
}
