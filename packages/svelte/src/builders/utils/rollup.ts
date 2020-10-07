import * as rollup from 'rollup';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BuilderOutput, BuilderContext } from '@angular-devkit/architect';
import { RollupWatcherEvent } from 'rollup';
import { NormalizedSvelteBuildOptions } from '../build/schema';
import { DependentBuildableProjectNode } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { normalizeAssetCopyCommands } from './normalize';
import { toClassName } from '@nrwl/workspace';

const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const sveltePreprocess = require('svelte-preprocess');
const svelte = require('rollup-plugin-svelte');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');

export function createRollupOptions(
  options: NormalizedSvelteBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  context: BuilderContext
): rollup.RollupOptions {
  let plugins = [
    copy({
      targets: normalizeAssetCopyCommands(
        options.assets,
        options.workspaceRoot,
        options.projectRoot,
        options.outputPath,
        context
      ),
    }),
    typescript({
      tsconfig: options.tsConfig,
      rootDir: options.projectRoot,
      sourceMap: options.dev,
    }),
    svelte({
      dev: options.dev,
      css: (css) => {
        css.write('bundle.css');
      },
      preprocess: sveltePreprocess(),
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
  ];

  if (options.serve) {
    plugins = [
      ...plugins,
      livereload(),
      serve({
        open: options.open,
        verbose: false,
        contentBase: options.outputPath,

        host: 'localhost',
        port: 5000,

        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    ];
  }

  const externalPackages = dependencies
    .map((dependency) => dependency.name)
    .concat(options.external || []);

  return {
    input: options.entryFile,
    output: {
      format: 'iife',
      file: `${options.outputPath}/bundle.js`,
      name: toClassName(context.target.project),
    },
    external: (id) => externalPackages.includes(id),
    plugins,
  } as rollup.RollupOptions;
}

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

export function runRollupWatch(
  context: BuilderContext,
  options: rollup.RollupOptions
): Observable<BuilderOutput> {
  return new Observable<BuilderOutput>((obs) => {
    const watcher = rollup.watch(options);
    context.logger.info('Project ready on http://localhost:5000');
    watcher.on('event', (data: RollupWatcherEvent) => {
      if (data.code === 'START') {
        context.logger.info('Bundling...');
      } else if (data.code === 'END') {
        context.logger.info('Bundle complete. Watching for file changes...');
        obs.next({ success: true });
      } else if (data.code === 'ERROR') {
        context.logger.error(`Error during bundle: ${data.error.message}`);
        obs.next({ success: false });
      }
    });
    // Teardown logic. Close watcher when unsubscribed.
    return () => watcher.close();
  });
}
