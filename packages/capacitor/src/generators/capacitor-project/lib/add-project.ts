import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nxext/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host: Tree, options: NormalizedSchema) {
  const projectConfiguration = readProjectConfiguration(host, options.project);
  const commands = ['add', 'copy', 'open', 'run', 'sync', 'update'];
  const platforms = ['ios', 'android'];

  projectConfiguration.targets.cap = {
    executor: '@nxext/capacitor:cap',
    options: {
      cmd: '--help',
    },
  };

  let command: string, platform: string;

  for (command of commands) {
    projectConfiguration.targets[command] = {
      executor: `@nxext/capacitor:cap`,
      options: {
        cmd: `${command}`,
      },
      configurations: {},
    };

    for (platform of platforms) {
      projectConfiguration.targets[command].configurations[platform] = {
        cmd: `${command} ${platform}`,
      };
    }
  }
  updateProjectConfiguration(host, options.project, projectConfiguration);
}
