import {
  CreateNodesV2,
  ProjectConfiguration,
  TargetConfiguration,
  createNodesFromFiles,
} from '@nx/devkit';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export type CapacitorPluginOptions = Record<string, unknown>;

export type CapCommand = 'add' | 'copy' | 'open' | 'run' | 'sync' | 'update';
export type CapPlatform = 'ios' | 'android';
export type CapCommandFormat =
  `cap ${CapCommand}` | `cap ${CapCommand} ${CapPlatform}`;

/**
 * Infers capacitor tasks for any project containing a `capacitor.config.ts`.
 *
 * Scope-by-design: targets shell out to the local `cap` CLI via
 * `nx:run-commands` with `cwd: projectRoot`. Every command additionally gets
 * a per-platform (`ios`/`android`) configuration, e.g. `nx run app:sync:ios`.
 */
export const createNodesV2: CreateNodesV2<CapacitorPluginOptions> = [
  '**/capacitor.config.ts',
  (configFiles, options, context) => {
    const workspaceRoot = context.workspaceRoot;

    const projectConfigFiles = configFiles.filter((configFile) => {
      const projectRoot = dirname(configFile);
      return (
        existsSync(join(workspaceRoot, projectRoot, 'project.json')) ||
        existsSync(join(workspaceRoot, projectRoot, 'package.json'))
      );
    });

    return createNodesFromFiles(
      (configFile) => {
        const projectRoot = dirname(configFile);

        return {
          projects: {
            [projectRoot]: {
              projectType: 'application',
              targets: buildTargets(projectRoot),
            },
          },
        };
      },
      projectConfigFiles,
      options,
      context,
    );
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
    platform?: CapPlatform,
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
