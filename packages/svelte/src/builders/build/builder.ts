import {
  BuilderContext,
  BuilderOutput,
  createBuilder,
} from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, switchMap, tap } from 'rxjs/operators';
import { SvelteBuildOptions } from './schema';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { calculateProjectDependencies } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { runRollup, runRollupWatch } from '../utils/rollup';
import { initRollupOptions } from '../utils/init';

export function runBuilder(
  options: SvelteBuildOptions,
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
                context.logger.error(`Error during bundle: ${e}`);
                return of({ success: false });
              }),
              tap((result) => {
                if (result.success) {
                  context.logger.info('Bundle complete.');
                } else {
                  context.logger.error('Bundle failed.');
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
