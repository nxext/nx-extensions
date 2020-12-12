import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RawSvelteBuildOptions } from './schema';

export function runBuilder(
  options: RawSvelteBuildOptions,
  context: BuilderContext
): Observable<BuilderOutput> {

  return from(context.scheduleBuilder('@nrwl/web:package', {
    outputPath: options.outputPath,
    tsConfig: options.tsConfig,
    project: options.project,
    entryFile: options.entryFile
  })).pipe(switchMap(x => x.result));

  /*
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
  );*/
}

export default createBuilder(runBuilder);
