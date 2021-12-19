/* eslint-disable @typescript-eslint/no-explicit-any */
const { resolve } = require('path');
const {
  ModuleResolutionKind,
  ModuleKind,
  ScriptTarget,
} = require('typescript');

const resolver = require('./resolver');
const compile = require('./compile');
const { optimizer, defautSideEffects } = require('./optimizer');

function ngcPlugin(options = {}) {
  let host, sideEffectFreeModules;
  const files = new Map();
  const {
    target = ScriptTarget.ESNext,
    rootDir = 'src',
    sourceMap = true,
  } = options;

  const opts = {
    target,
    module: ModuleKind.ESNext,
    lib: ['es2017', 'es2018', 'esnext', 'dom'],
    types: ['vite/client'],
    rootDir: resolve(rootDir),
    declaration: false,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    sourceMap,
    strict: true,
    resolveJsonModule: true,
    esModuleInterop: true,
  };
  let configResolved;

  return {
    name: 'nxext-angular',
    configResolved(config) {
      configResolved = config;
      return {
        esbuild: {
          exclude: /\.ts$/,
        },
      };
    },
    buildStart: async () => {
      sideEffectFreeModules = defautSideEffects(
        options?.buildOptimizer?.sideEffectFreeModules
      );
    },
    resolveId: resolver(),
    async transform(code, id) {
      if (!id.includes('node_modules')) {
        return await compile({
          id: resolve(id).replace(/\\/g, '/'),
          host: host,
          options: opts,
          files,
          configResolved,
        });
      }
      return await optimizer(code, id, {
        sideEffectFreeModules,
        angularCoreModules: options?.buildOptimizer?.angularCoreModules,
        compile: opts,
      });
    },
  };
}

module.exports = ngcPlugin;
