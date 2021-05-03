import * as rollup from 'rollup';
import { RollupWatcherEvent } from 'rollup';
import { Observable } from 'rxjs';
import { BuilderOutput } from '@angular-devkit/architect';
import { SvelteBuildOptions } from '../build/schema';
import * as url from 'url';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { ExecutorContext, logger } from '@nrwl/devkit';

export function runRollupWatch(
  context: ExecutorContext,
  rollupOptions: rollup.RollupOptions,
  svelteBuildOptions: SvelteBuildOptions
): Observable<BuilderOutput> {
  return new Observable<BuilderOutput>((obs) => {
    const watcher = rollup.watch(rollupOptions);

    const serverUrl = url.format({
      protocol: 'http',
      hostname: svelteBuildOptions.host,
      port: svelteBuildOptions.port.toString(),
    });

    logger.info(stripIndents`
      **
      Web Development Server is listening at ${serverUrl}
      **
    `);

    watcher.on('event', (data: RollupWatcherEvent) => {
      if (data.code === 'START') {
        logger.info('Bundling...');
      } else if (data.code === 'END') {
        logger.info('Bundle complete. Watching for file changes...');
        obs.next({ success: true });
      } else if (data.code === 'ERROR') {
        logger.error(`Error during bundle: ${data.error.message}`);
        obs.next({ success: false });
      }
    });
    // Teardown logic. Close watcher when unsubscribed.
    return () => watcher.close();
  });
}
