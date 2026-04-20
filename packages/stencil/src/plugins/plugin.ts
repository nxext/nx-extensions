import {
  CreateNodesV2,
  ProjectConfiguration,
  TargetConfiguration,
} from '@nx/devkit';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export interface StencilPluginOptions {
  buildTargetName?: string;
  serveTargetName?: string;
  testTargetName?: string;
  e2eTargetName?: string;
}

/**
 * Infers stencil tasks for any project containing a `stencil.config.ts`.
 *
 * Scope-by-design: targets shell out to the local `stencil` CLI via
 * `nx:run-commands` with `cwd: projectRoot`. No custom executor, no runtime
 * path rewriting — the stencil config itself is the source of truth for where
 * output lands (typically `<projectRoot>/www` or `<projectRoot>/dist`, plus
 * the `<workspaceRoot>/dist/<projectRoot>` convention the @nxext/stencil
 * generator templates write).
 *
 * `{workspaceRoot}/dist/{projectRoot}` is listed as the cache output. That
 * covers the nxext-generated template's configured output directory. Users
 * with non-standard stencil output paths should override the inferred `outputs`
 * locally in their project.json.
 */
export const createNodesV2: CreateNodesV2<StencilPluginOptions> = [
  '**/stencil.config*.ts',
  (configFiles, rawOptions, context) => {
    const options = normalizeOptions(rawOptions);
    const workspaceRoot = context.workspaceRoot;

    return configFiles.flatMap((configFile) => {
      const projectRoot = dirname(configFile);

      const isProject =
        existsSync(join(workspaceRoot, projectRoot, 'project.json')) ||
        existsSync(join(workspaceRoot, projectRoot, 'package.json'));
      if (!isProject) {
        return [];
      }

      return [
        [
          configFile,
          {
            projects: {
              [projectRoot]: {
                targets: buildTargets(projectRoot, options),
                metadata: {
                  technologies: ['stencil'],
                },
              },
            },
          },
        ],
      ];
    });
  },
];

type NormalizedOptions = Required<StencilPluginOptions>;

function normalizeOptions(
  options: StencilPluginOptions | undefined
): NormalizedOptions {
  return {
    buildTargetName: options?.buildTargetName ?? 'build',
    serveTargetName: options?.serveTargetName ?? 'serve',
    testTargetName: options?.testTargetName ?? 'test',
    e2eTargetName: options?.e2eTargetName ?? 'e2e',
  };
}

function buildTargets(
  projectRoot: string,
  options: NormalizedOptions
): ProjectConfiguration['targets'] {
  const commonOptions: Partial<TargetConfiguration> = {
    options: { cwd: projectRoot },
    metadata: { technologies: ['stencil'] },
  };

  return {
    [options.buildTargetName]: {
      command: 'stencil build',
      cache: true,
      inputs: ['default', '^production'],
      outputs: [
        `{workspaceRoot}/dist/${projectRoot}`,
        `{projectRoot}/www`,
        `{projectRoot}/dist`,
      ],
      ...commonOptions,
    },
    [options.serveTargetName]: {
      command: 'stencil build --dev --watch --serve',
      cache: false,
      ...commonOptions,
    },
    [options.testTargetName]: {
      command: 'stencil test --spec',
      cache: true,
      inputs: ['default', '^production'],
      ...commonOptions,
    },
    [options.e2eTargetName]: {
      command: 'stencil test --e2e',
      cache: false,
      ...commonOptions,
    },
  };
}
