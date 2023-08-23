import { NuxtBuildExecutorOptions } from './schema';
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph';
import { ExecutorContext, logger } from '@nx/devkit';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nx/workspace/src/utilities/buildable-libs-utils';
import { join } from 'path';

// Required because dep is ESM package. Changing moduleResolution to NodeNext causes other issues unfortunately.
export function loadNuxtKitDynamicImport() {
  return Function('return import("@nuxt/kit")')() as Promise<
    typeof import('@nuxt/kit')
  >;
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
    },
  };
}

async function loadNuxtInstance(
  options: NuxtBuildExecutorOptions,
  context: ExecutorContext
) {
  const { loadNuxt } = await loadNuxtKitDynamicImport();
  const nuxt = await loadNuxt({
    cwd: join(
      context.root,
      context.projectsConfigurations.projects[context.projectName].root
    ),
    overrides: getConfigOverrides(options, context),
  });
  return nuxt;
}

async function build(
  options: NuxtBuildExecutorOptions,
  context: ExecutorContext
) {
  const nuxt = await loadNuxtInstance(options, context);
  const { buildNuxt } = await loadNuxtKitDynamicImport();

  try {
    await buildNuxt(nuxt).catch((err) => {
      if (!err.toString().includes('_stop_')) {
        throw err;
      }
    });
  } finally {
    nuxt.close();
  }
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

  try {
    await build(options, context);

    return { success: true };
  } catch (err) {
    logger.error(err.message);

    return { success: false, error: err.message };
  }
}
