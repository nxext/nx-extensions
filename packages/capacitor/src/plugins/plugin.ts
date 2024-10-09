import {
  CreateNodesV2,
  getPackageManagerCommand,
  ProjectConfiguration
} from '@nx/devkit';
import { dirname } from 'node:path';

const pmc = getPackageManagerCommand();

export interface CapacitorPluginOptions {}

export const createNodes: CreateNodesV2<CapacitorPluginOptions> = [
  '**/capacitor.config.ts',
  (configFiles, options, context) => {
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
      ] as const;
    });
  },
];

function buildTargets(projectRoot: string): ProjectConfiguration['targets'] {
  return {
    cap: {
      command: `${pmc.exec} cap {args.cmd}`,
      options: {
        cwd: projectRoot,
      },
    },
  };
}
