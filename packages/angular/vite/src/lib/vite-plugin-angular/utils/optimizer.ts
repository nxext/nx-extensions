import { buildOptimizer } from '@angular-devkit/build-optimizer';
import { readdirSync } from 'fs';
import { join, relative } from 'path';
import { RawSourceMap } from 'source-map';

const DEBUG = false;

export const defautSideEffects = (sideEffectFreeModules?: string[]) => {
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

export interface OptimizerOptions {
  sideEffectFreeModules?: string[];
  angularCoreModules?: string[];
}

/// this is original code from
/// https://github.com/angular/angular-cli/blob/master/packages/angular_devkit/build_optimizer/src/build-optimizer/rollup-plugin.ts
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function optimizer(
  content: string,
  id: string,
  options: OptimizerOptions
): Promise<{ map: RawSourceMap | null; code: string } | null> {
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

  return { map: ngMaps, code: optCode };
}
