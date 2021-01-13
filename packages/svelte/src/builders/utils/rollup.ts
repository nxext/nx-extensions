import * as rollup from 'rollup';
import { RollupWatcherEvent } from 'rollup';
import { Observable } from 'rxjs';
import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { SvelteBuildOptions, RawSvelteBuildOptions } from '../build/schema';
import { DependentBuildableProjectNode } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import { toClassName } from '@nrwl/workspace';
import { logger } from '@nrwl/devkit';
import * as url from 'url';
import { stripIndents } from '@angular-devkit/core/src/utils/literals';
import { convertCopyAssetsToRollupOptions } from './normalize';
import resolve from '@rollup/plugin-node-resolve';
import { join } from 'path';

/* eslint-disable */
const typescript = require('@rollup/plugin-typescript');
const sveltePreprocess = require('svelte-preprocess');
const svelte = require('rollup-plugin-svelte')
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only')
const commonjs = require('@rollup/plugin-commonjs');
/* eslint-enable */

export function createRollupOptions(
  options: SvelteBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  context: BuilderContext
): rollup.RollupOptions {
  /* eslint-disable */
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? require(options.sveltePreprocessConfig)(options)
    : {};
  /* eslint-enable */

  let plugins = [
    copy({
      targets: convertCopyAssetsToRollupOptions(
        options.assets
      ),
    }),
    typescript({
      tsconfig: options.tsConfig,
      rootDir: options.projectRoot,
      sourceMap: !options.prod,
      inlineSources: !options.prod
    }),
    svelte({
      compilerOptions: {
        dev: !options.prod,
      },
      preprocess: sveltePreprocess(sveltePreprocessConfig),
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),

    options.prod &&
      terser({
        output: {
          comments: false,
        },
      }),
  ];

  if (options.serve) {
    plugins = [
      ...plugins,
      livereload(),
      serve({
        open: options.open,
        verbose: false,
        contentBase: options.outputPath,
        host: options.host,
        port: options.port,
      }),
    ];
  }

  const externalPackages = dependencies
    .map((dependency) => dependency.name)
    .concat(options.external || []);

  const rollupConfig = {
    input: options.entryFile,
    output: {
      format: 'iife',
      file: join(options.outputPath, 'bundle.js'),
      name: toClassName(context.target.project),
    },
    external: (id) => externalPackages.includes(id),
    plugins,
  } as rollup.RollupOptions;

  /* eslint-disable */
  return options.rollupConfig
    ? require(options.rollupConfig)(rollupConfig, options)
    : rollupConfig;
  /* eslint-enable */
}

export async function runRollup(
  options: rollup.RollupOptions
): Promise<BuilderOutput> {
  const bundle = await rollup.rollup(options);

  const outputOptions: rollup.OutputOptions[] = Array.isArray(
    options.output
  ) ? options.output : [options.output];

  return Promise.all(outputOptions.map((output) => bundle.write(output)))
    .then(() => {
      logger.info('Bundle complete.');
      return { success: true }
    })
    .catch((error) => {
      logger.error(`Error during bundle: ${error}`);
      logger.error('Bundle failed.');
      return { success: false }
    });
}

export function runRollupWatch(
  context: BuilderContext,
  rollupOptions: rollup.RollupOptions,
  svelteBuildOptions: RawSvelteBuildOptions
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
