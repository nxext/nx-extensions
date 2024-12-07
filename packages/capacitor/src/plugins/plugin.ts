import {
  CreateNodesV2,
  getPackageManagerCommand,
  ProjectConfiguration,
} from '@nx/devkit';
import { dirname } from 'node:path';

const pmc = getPackageManagerCommand();

export interface CapacitorPluginOptions {}

export const createNodesV2: CreateNodesV2<CapacitorPluginOptions> = [
  '**/capacitor.config.ts',
  (configFiles) => {
    return configFiles.map((configFile) => {
      const projectRoot = dirname(configFile);
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
  const targetNames = ['add', 'copy', 'open', 'run', 'sync', 'update'];
  const platforms = ['ios', 'android'];

  const targets: ProjectConfiguration['targets'] = {
    cap: {
      executor: '@nxext/capacitor:cap',
      options: {
        cmd: '--help',
      },
    },
  };

  for (const command of targetNames) {
    targets[command] = {
      executor: `@nxext/capacitor:cap`,
      options: {
        cmd: `${command}`,
      },
      configurations: {},
      cache: false,
      metadata: {
        technologies: ['Capacitor'],
      },
    };

    for (const platform of platforms) {
      targets[command].configurations[platform] = {
        cmd: `${command} ${platform}`,
      };
    }
  }

  return targets;
}
