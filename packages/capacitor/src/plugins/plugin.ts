import { CreateNodesV2, ProjectConfiguration } from '@nx/devkit';
import { dirname } from 'node:path';

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
              targets: buildTargets(),
            },
          },
        },
      ];
    });
  },
];

function buildTargets(): ProjectConfiguration['targets'] {
  const targetNames = ['add', 'copy', 'open', 'run', 'sync', 'update'];
  const platforms = ['ios', 'android'];

  const targets: ProjectConfiguration['targets'] = {
    cap: {
      executor: '@nxext/capacitor:cap',
      options: {
        cmd: '--help',
      },
      cache: false,
      metadata: {
        technologies: ['capacitor'],
      },
    },
  };

  for (const command of targetNames) {
    targets[command] = {
      executor: `@nxext/capacitor:cap`,
      options: {
        cmd: `${command}`,
      },
      cache: false,
      metadata: {
        technologies: ['capacitor'],
      },
    };

    for (const platform of platforms) {
      targets[command].configurations ??= {};
      targets[command].configurations[platform] = {
        cmd: `${command} ${platform}`,
      };
    }
  }

  return targets;
}
