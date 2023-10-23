import { NuxtServeOptions } from './schema';
import { createProjectGraphAsync } from '@nx/workspace/src/core/project-graph';
import { createAsyncIterable } from '@nx/devkit/src/utils/async-iterable';
import { ExecutorContext } from '@nx/devkit';
import type { LoadNuxtConfigOptions } from '@nuxt/kit';
import { join } from 'path';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  updateBuildableProjectPackageJsonDependencies,
} from '@nx/js/src/utils/buildable-libs-utils';

// Required because dep is ESM package. Changing moduleResolution to NodeNext causes other issues unfortunately.
export function loadNuxiDynamicImport() {
  return Function('return import("nuxi")')() as Promise<typeof import('nuxi')>;
}

export function getConfigOverrides(
  options: NuxtServeOptions,
  context: ExecutorContext
): LoadNuxtConfigOptions['overrides'] {
  return {
    workspaceDir: context.root,
    devServer: {
      host: options.host,
      port: options.port,
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
    debug: options.debug,
    dev: options.dev,
    ssr: options.ssr,
  };
}

export default async function* runExecutor(
  options: NuxtServeOptions,
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
    yield { success: false };
  }

  updateBuildableProjectPackageJsonDependencies(
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName,
    target,
    dependencies
  );

  yield* createAsyncIterable<{ success: boolean }>(async ({ next, error }) => {
    try {
      const { runCommand } = await loadNuxiDynamicImport();
      await runCommand(
        'dev',
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

      next({
        success: true,
      });
    } catch (err) {
      error(new Error(`Nuxt app exited with message ${err.message}`));
    }
  });
}
