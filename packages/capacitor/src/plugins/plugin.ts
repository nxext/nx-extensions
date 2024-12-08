import {
  CreateNodesV2,
  ProjectConfiguration,
  TargetConfiguration,
} from '@nx/devkit';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export interface CapacitorPluginOptions {}

export type CapCommand = 'add' | 'copy' | 'open' | 'run' | 'sync' | 'update';
export type CapPlatform = 'ios' | 'android';
export type CapCommandFormat =
  | `cap ${CapCommand}`
  | `cap ${CapCommand} ${CapPlatform}`;

export const createNodesV2: CreateNodesV2<CapacitorPluginOptions> = [
  '**/capacitor.config.ts',
  (configFiles) => {
    return configFiles.map((configFile) => {
      const projectRoot = dirname(configFile);

      const isProject =
        existsSync(join(projectRoot, 'project.json')) ||
        existsSync(join(projectRoot, 'package.json'));
      if (!isProject) {
        return null;
      }

      return [
        projectRoot,
        {
          projects: {
            [projectRoot]: {
              projectType: 'application',
              targets: buildTargets(projectRoot),
            },
          },
        },
      ];
    });
  },
];

function buildTargets(projectRoot: string): ProjectConfiguration['targets'] {
  const commands: CapCommand[] = [
    'add',
    'copy',
    'open',
    'run',
    'sync',
    'update',
  ];
  const platforms: CapPlatform[] = ['ios', 'android'];

  const baseTargetOptions: TargetConfiguration<any> = {
    options: {
      cwd: projectRoot,
    },
    cache: false,
    metadata: {
      technologies: ['capacitor'],
    },
  };

  const targets: ProjectConfiguration['targets'] = {
    cap: {
      command: 'cap --help',
      ...baseTargetOptions,
    },
  };

  const formatCapCommand = (
    command: CapCommand,
    platform?: CapPlatform
  ): CapCommandFormat => {
    if (platform) {
      return `cap ${command} ${platform}`;
    }

    return `cap ${command}`;
  };

  for (const command of commands) {
    targets[command] = {
      command: formatCapCommand(command),
      ...baseTargetOptions,
    };

    for (const platform of platforms) {
      targets[command].configurations ??= {};
      targets[command].configurations[platform] = {
        command: formatCapCommand(command, platform),
      };
    }
  }

  return targets;
}
