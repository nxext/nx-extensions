import { from, of } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { RawSvelteBuildOptions } from './schema';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';
import { runRollup } from '../utils/run-rollup';
import { runRollupWatch } from '../utils/run-rollup-watch';
import { ExecutorContext, logger } from '@nrwl/devkit';
import { normalizeOptions } from '../utils/normalize';
import { createRollupOptions } from '../utils/rollup-options';

export default async function runExecutor(
  rawOptions: RawSvelteBuildOptions,
  context: ExecutorContext
) {
  const project = context.workspace.projects[context.projectName];
  const sourceRoot = project.sourceRoot;
  const projGraph = createProjectGraph();
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
    throw new Error();
  }

  const options = normalizeOptions(
    { ...rawOptions, project: context.projectName },
    context.root,
    sourceRoot
  );

  let svelteConfig = null;
  if (options.svelteConfig) {
    svelteConfig = await import(options.svelteConfig);
  }
  const initOptions = { ...options, dependencies };
  return of(createRollupOptions(initOptions, dependencies, context, svelteConfig))
    .pipe(
      switchMap((rollupOptions) => {
        if (options.watch) {
          return runRollupWatch(context, rollupOptions, options);
        } else {
          return of(rollupOptions).pipe(
            concatMap((options) =>
              runRollup(options).pipe(
                catchError((e) => {
                  logger.error(`Error during bundle: ${e}`);
                  return of({ success: false });
                }),
                tap((result) => {
                  if (result.success) {
                    logger.info('Bundle complete.');
                  } else {
                    logger.error('Bundle failed.');
                  }
                })
              )
            )
          );
        }
      })
    )
    .toPromise();
}
