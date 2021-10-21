import { SvelteBuildOptions } from '../build/schema';
import * as rollup from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import * as localResolve from 'rollup-plugin-local-resolve';
import * as path from 'path';
import { convertCopyAssetsToRollupOptions } from './normalize-assets';
import {
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';
import { ExecutorContext, names } from '@nrwl/devkit';

/* eslint-disable */
const typescript = require('@rollup/plugin-typescript');
const sveltePreprocess = require('svelte-preprocess');
const svelte = require('rollup-plugin-svelte');
const copy = require('rollup-plugin-copy');
const image = require('@rollup/plugin-image');
const serve = require('rollup-plugin-serve-proxy');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const css = require('rollup-plugin-css-only');
const commonjs = require('@rollup/plugin-commonjs');
/* eslint-enable */

const fileExtensions = ['.js', '.ts', '.svelte'];

interface OutputConfig {
  format: rollup.ModuleFormat;
  extension: string;
  declaration?: boolean;
}

const outputConfigs: OutputConfig[] = [
  { format: 'umd', extension: 'umd' },
  { format: 'esm', extension: 'esm' },
];

function getSveltePluginConfig(svelteConfig: any, options: SvelteBuildOptions) {
  /* eslint-disable */
  const sveltePreprocessConfig = options.sveltePreprocessConfig
    ? require(options.sveltePreprocessConfig)(options)
    : {};
  /* eslint-enable */
  if (svelteConfig == null) {
    return {
      compilerOptions: {
        dev: !options.prod,
      },
      preprocess: sveltePreprocess(sveltePreprocessConfig),
    };
  } else {
    const compilerOptions = svelteConfig.compilerOptions
      ? { ...svelteConfig.compilerOptions, dev: !!options.prod }
      : { dev: !!options.prod };
    return { ...svelteConfig, compilerOptions: compilerOptions };
  }
}

export function createRollupOptions(
  options: SvelteBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  context: ExecutorContext,
  svelteConfig: string | null
): rollup.RollupOptions {
  const sveltePluginConfig = getSveltePluginConfig(svelteConfig, options);

  const compilerOptionPaths = computeCompilerOptionsPaths(
    options.tsConfig,
    dependencies
  );

  let plugins = [
    copy({
      targets: convertCopyAssetsToRollupOptions(
        options.outputPath,
        options.assets
      ),
    }),
    image(),
    typescript({
      sourceMap: !options.prod,
      tsconfig: options.tsConfig,
      rootDir: options.projectRoot,
      paths: compilerOptionPaths,
    }),
    svelte(sveltePluginConfig),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),
    localResolve(),
    resolve({
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
    let serveOptions = {
      open: options.open,
      verbose: false,
      contentBase: options.outputPath,
      host: options.host,
      port: options.port,
      historyApiFallback: true,
      headers: {},
      proxy: options.proxy,
    };

    if (options.headers.length != 0) {
      serveOptions = {
        ...serveOptions,
        headers: Object.assign(
          {},
          ...options.headers.map((header) => ({ [header.key]: header.value }))
        ),
      };
    }

    plugins = [...plugins, livereload(), serve(serveOptions)];
  }

  const externalPackages = dependencies
    .map((dependency) => dependency.name)
    .concat(options.external || []);

  const rollupConfig = {
    input: options.entryFile,
    output: {
      format: 'iife',
      file: path.join(options.outputPath, 'bundle.js'),
      name: names(options.project).className,
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
