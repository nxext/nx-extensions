import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RawSvelteBuildOptions } from './schema';
import { createProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt
} from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { runRollup, runRollupWatch } from '../utils/rollup';
import { getSourceRoot } from '../utils/source-root';
import { normalizeOptions } from '../utils/normalize';

export function runBuilder(
  options: RawSvelteBuildOptions,
  context: BuilderContext
): Observable<BuilderOutput> {
  const projGraph = createProjectGraph();
  const { dependencies } = calculateProjectDependencies(projGraph, context);

  return from(getSourceRoot(context)).pipe(
    switchMap((sourceRoot) => {
      if (!checkDependentProjectsHaveBeenBuilt(context, dependencies)) {
        return of({ success: false });
      }

      const normalizedOptions = normalizeOptions(options, context.workspaceRoot, sourceRoot);

      return from(normalizedOptions).pipe(
        switchMap((rollupOptions) => {
          if (options.watch) {
            return runRollupWatch(context, rollupOptions, options);
          } else {
            return from(runRollup(rollupOptions));
          }
        })
      );
    })
  );
}

export default createBuilder(runBuilder);
