import * as rollup from 'rollup';
import { from, Observable } from 'rxjs';
import { BuilderOutput } from '@angular-devkit/architect';
import { map, switchMap } from 'rxjs/operators';

export function runRollup(
  options: rollup.RollupOptions
): Observable<BuilderOutput> {
  return from(rollup.rollup(options)).pipe(
    switchMap((bundle) => {
      const outputOptions: rollup.OutputOptions[] = Array.isArray(
        options.output
      )
        ? options.output
        : [options.output];
      return from(
        Promise.all(outputOptions.map((output) => bundle.write(output)))
      );
    }),
    map(() => ({ success: true }))
  );
}
