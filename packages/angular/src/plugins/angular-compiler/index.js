/* eslint-disable @typescript-eslint/no-explicit-any */
const { resolve } = require('path');
const { ModuleResolutionKind } = require('typescript');

const resolver = require('./resolver');
const compile = require('./compile');
const { optimizer, defautSideEffects } = require('./optimizer');

function ngcPlugin(options = {}) {
  let host, sideEffectFreeModules;
  const files = new Map();
  const { target = 'es2018', rootDir = 'src', sourceMap = true } = options;

  const opts = {
    target: target.toLocaleUpperCase(),
    module: 'ESNext',
    lib: ['dom', 'es2015', 'es2017', 'es2018', 'es2019'],
    rootDir: resolve(rootDir),
    moduleResolution: ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    declaration: false,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    sourceMap,
  };
  let configResolved;

  return {
    name: 'nxext-angular',
    configResolved(config) {
      configResolved = config;
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
