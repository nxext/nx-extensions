import { buildOptimizer } from '@angular-devkit/build-optimizer';
import { readdirSync } from 'fs';
import { join, relative } from 'path';
import { RawSourceMap } from 'source-map';
import { EsbuildExecutor } from '@angular-devkit/build-angular/src/webpack/plugins/esbuild-executor';
import { CompilerOptions } from 'typescript';

const DEBUG = false;

const esbuild = new EsbuildExecutor(true);

export interface Options {
  sideEffectFreeModules?: string[];
  angularCoreModules?: string[];
}

export const defautSideEffects = (sideEffectFreeModules?: string[]) => {
  const sideEffects = readdirSync('node_modules/@angular').map((effect) =>
    join('node_modules/@angular', effect)
  );
  return [
    ...sideEffects,
    'node_modules/rxjs',
    'node_modules/zonejs',
    ...(sideEffectFreeModules ?? []),
  ].map((p) => p.replace(/\\/g, '/'));
};

export interface OptimizerOptions extends CompilerOptions {
  sideEffectFreeModules?: string[];
  angularCoreModules?: string[];
}

/// this is original code from
/// https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/build_optimizer/src/build-optimizer/rollup-plugin.ts
export async function optimizer(
  content: string,
  id: string,
  options: OptimizerOptions
) {
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
  const { content: optCode } = buildOptimizer({
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

  const { code, map } = await esbuild.transform(optCode, options as unknown);

  return { code, map };
}
