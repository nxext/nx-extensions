const { buildOptimizer } = require('@angular-devkit/build-optimizer');
const { readdirSync } = require('fs');
const { join, relative } = require('path');
const {
  EsbuildExecutor,
} = require('@angular-devkit/build-angular/src/webpack/plugins/esbuild-executor');
const compile = require('./compile');

const DEBUG = false;

const esbuild = new EsbuildExecutor(true);

const defautSideEffects = (sideEffectFreeModules) => {
  const sideEffects = readdirSync('node_modules/@angular').map((effect) =>
    join('node_modules/@angular', effect)
  );
  return [
    ...sideEffects,
    'node_modules/rxjs',
    'node_modules/zone.js',
    ...(sideEffectFreeModules ?? []),
  ].map((p) => p.replace(/\\/g, '/'));
};

/// this is original code from
/// https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/build_optimizer/src/build-optimizer/rollup-plugin.ts
async function optimizer(content, id, options) {
  if (options.sideEffectFreeModules) {
    options.sideEffectFreeModules = options.sideEffectFreeModules.map((p) =>
      p.replace(/\\/g, '/')
    );
  }

  const normalizedId = id.replace(/\\/g, '/');
  const isSideEffectFree =
    options.sideEffectFreeModules &&
    options.sideEffectFreeModules.some((m) => normalizedId.indexOf(m) >= 0);
  const isAngularCoreFile =
    options.angularCoreModules &&
    options.angularCoreModules.some((m) => normalizedId.indexOf(m) >= 0);
  const { content: optCode, sourceMap: ngMaps } = buildOptimizer({
    content,
    inputFilePath: id,
    emitSourceMap: true,
    isSideEffectFree,
    isAngularCoreFile,
  });
  if (!optCode) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error(
        'no transforms produced by buildOptimizer for ' +
          relative(process.cwd(), id)
      );
    }

    return null;
  }

  // if (!id.includes('node_modules')) {
  //   const { code, map } = await esbuild.transform(optCode, {...options.compile, moduleResolution: undefined });

  //   return { code, map };
  // } else {
  return { map: ngMaps, code: optCode };
  // }
}

module.exports = {
  optimizer,
  defautSideEffects,
};
