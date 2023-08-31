import { NuxtBuildExecutorOptions } from './schema';
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph';
import { ExecutorContext } from '@nx/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nx/workspace/src/utilities/buildable-libs-utils';
import { join } from 'path';

// Required because dep is ESM package. Changing moduleResolution to NodeNext causes other issues unfortunately.
export function loadNuxiDynamicImport() {
  return Function('return import("nuxi")')() as Promise<typeof import('nuxi')>;
}

export function getConfigOverrides(
  options: NuxtBuildExecutorOptions,
  context: ExecutorContext
) {
  return {
    ...options,
    workspaceDir: context.root,
    buildDir: join(context.root, options.outputPath, '.nuxt'),
    nitro: {
      output: {
        dir: join(context.root, options.outputPath, '.output'),
      },
    },
    typescript: {
      typeCheck: true,
      tsConfig: {
        extends: join(
          context.root,
          context.projectsConfigurations.projects[context.projectName].root,
          'tsconfig.app.json'
        ),
      },
    },
  };
}

export default async function runExecutor(
  options: NuxtBuildExecutorOptions,
  context: ExecutorContext
) {
  const projGraph = await createProjectGraphAsync();
  const { target, dependencies } = calculateProjectDependencies(
    projGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName
  );

  if (
    !checkDependentProjectsHaveBeenBuilt(
      context.root,
      context.projectName,
      context.targetName,
      dependencies
    )
  ) {
    return { success: false };
  }

  updateBuildableProjectPackageJsonDependencies(
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName,
    target,
    dependencies
  );

  const { runCommand } = await loadNuxiDynamicImport();
  await runCommand(
    'build',
    [
      join(
        context.root,
        context.projectsConfigurations.projects[context.projectName].root
      ),
    ],
    {
      overrides: getConfigOverrides(options, context),
    }
  );
  return { success: true };
}
