import {
  addProjectConfiguration,
  ProjectConfiguration,
  Tree,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host: Tree, options: NormalizedSchema) {
  const project: ProjectConfiguration = {
    root: options.appProjectRoot,
    sourceRoot: `${options.appProjectRoot}`,
    projectType: 'application',
    targets: {
      build: {
        executor: '@nxext/nuxt:build',
        outputs: ['{options.outputFile}'],
        options: {
          outputPath: `dist/${options.appProjectRoot}`,
        },
      },
      serve: {
        executor: '@nxext/nuxt:serve',
        outputs: ['{options.outputFile}'],
      },
    },
    tags: options.parsedTags,
  };

  addProjectConfiguration(host, options.appProjectName, {
    ...project,
  });
}
