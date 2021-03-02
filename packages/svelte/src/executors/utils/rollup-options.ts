import { SvelteBuildOptions } from '../build/schema';
import { DependentBuildableProjectNode } from '@nrwl/workspace/src/utils/buildable-libs-utils';
import * as rollup from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import * as localResolve from 'rollup-plugin-local-resolve';
import { toClassName } from '@nrwl/workspace';
import * as path from 'path';
import { convertCopyAssetsToRollupOptions } from './normalize-assets';

/* eslint-disable */
const typescript = require('@rollup/plugin-typescript');
const sveltePreprocess = require('svelte-preprocess');
const svelte = require('rollup-plugin-svelte');
const copy = require('rollup-plugin-copy');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only');
const commonjs = require('@rollup/plugin-commonjs');
/* eslint-enable */

const fileExtensions = ['.js', '.ts', '.svelte'];

export function createRollupOptions(
  options: SvelteBuildOptions,
  dependencies: DependentBuildableProjectNode[]
): rollup.RollupOptions {
  /* eslint-disable */
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? require(options.sveltePreprocessConfig)(options)
    : {};
  /* eslint-enable */

  let plugins = [
    copy({
      targets: convertCopyAssetsToRollupOptions(options.outputPath, options.assets),
    }),
    typescript({
      tsconfig: options.tsConfig,
      rootDir: options.entryRoot,
      sourceMap: !options.prod,
      inlineSources: !options.prod,
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
    localResolve(),
    resolve({
      browser: true,
      dedupe: ['svelte'],
      preferBuiltins: true,
      extensions: fileExtensions,
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
      file: path.join(options.outputPath, 'bundle.js'),
      name: toClassName(options.project),
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
