import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RawSvelteBuildOptions } from './schema';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import { calculateProjectDependencies } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { runRollup, runRollupWatch } from '../utils/rollup';
import { initRollupOptions } from '../utils/init';

export function runBuilder(
  options: RawSvelteBuildOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const projGraph = createProjectGraph();
  const { dependencies } = calculateProjectDependencies(projGraph, context);

  const normalizedOptions = initRollupOptions(options, dependencies, context);

  return from(normalizedOptions).pipe(
    switchMap((rollupOptions) => {
      if (options.watch) {
        return runRollupWatch(context, rollupOptions, options);
      } else {
        return from(runRollup(rollupOptions));
      }
    })
  );
}

export default createBuilder(runBuilder);
