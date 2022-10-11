import {
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
  ProjectConfiguration,
} from '@nrwl/devkit';
import { NormalizedSchema } from '../schema';

export function addProject(host: Tree, options: NormalizedSchema) {
  const { project: projectName } = options;
  const projectConfiguration: ProjectConfiguration = readProjectConfiguration(
    host,
    projectName
  );
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

  updateProjectConfiguration(host, projectName, projectConfiguration);
}
