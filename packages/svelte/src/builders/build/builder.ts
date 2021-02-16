import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { RawSvelteBuildOptions } from './schema';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { calculateProjectDependencies } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { runRollup } from '../utils/run-rollup';
import { runRollupWatch } from '../utils/run-rollup-watch';
import { initRollupOptions } from '../utils/init-rollup-options';
import { logger } from '@nrwl/devkit';

export function runBuilder(
  options: RawSvelteBuildOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const projGraph = createProjectGraph();
  const { dependencies } = calculateProjectDependencies(projGraph, context);

  return from(initRollupOptions(options, dependencies, context)).pipe(
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
  );
}

export default createBuilder(runBuilder);
