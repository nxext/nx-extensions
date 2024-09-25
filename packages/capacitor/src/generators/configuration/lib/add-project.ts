import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(host, options.project);
  const commands = ['add', 'copy', 'open', 'run', 'sync', 'update'];
  const platforms = ['ios', 'android'];

  projectConfig.targets.cap = {
    executor: '@nxext/capacitor:cap',
    options: {
      cmd: '--help',
    },
  };

  let command: string, platform: string;

  for (command of commands) {
    projectConfig.targets[command] = {
      executor: `@nxext/capacitor:cap`,
      options: {
        cmd: `${command}`,
      },
      configurations: {},
    };

    for (platform of platforms) {
      projectConfig.targets[command].configurations[platform] = {
        cmd: `${command} ${platform}`,
      };
    }
  }
  updateProjectConfiguration(host, options.project, projectConfig);
}
