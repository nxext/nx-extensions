import { from, Observable, of } from 'rxjs';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { catchError, map, switchMap } from 'rxjs/operators';
import { runTask } from '@stencil/core/cli';
import { cleanupE2eTesting } from './e2e-testing';
import { ConfigAndCoreCompiler } from './types';
import { logger } from '@nrwl/devkit';

export function createStencilProcess(context: BuilderContext) {
  return function (
    source: Observable<ConfigAndCoreCompiler>
  ): Observable<BuilderOutput> {
    return source.pipe(
      switchMap((values) =>
        from(
          runTask(values.coreCompiler, values.config, values.config.flags.task)
        ).pipe(
          map(() => values),
          cleanupE2eTesting()
        )
      ),
      catchError((err) => {
        logger.error(err.message);
        return of({ success: false, error: err.message });
      }),
      map(() => ({ success: true }))
    );
  };
}
