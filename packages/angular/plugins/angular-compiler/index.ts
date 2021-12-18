import { resolve } from 'path';
import {
  CompilerOptions,
  ScriptTarget,
  ModuleKind,
  ModuleResolutionKind,
  CompilerHost,
} from 'typescript';
import {
  createCompilerHost,
  CompilerHost as NgCompilerHost,
} from '@angular/compiler-cli';

import { resolver } from './resolver';
import { compile } from './compile';
import { OptimizerOptions, optimizer, defautSideEffects } from './optimizer';

export interface Options {
  rootDir?: string;
  sourceMap?: boolean;
  target?: string;
  buildOptimizer?: OptimizerOptions;
}

export function ngcPlugin(options?: Options) {
  let host: CompilerHost, sideEffectFreeModules: string[];
  const files = new Map();

  const { target = 'es2018', rootDir = 'src', sourceMap = true } = options;

  const opts: CompilerOptions = {
    target: ScriptTarget[target.toLocaleUpperCase()],
    module: ModuleKind.ESNext,
    lib: ['dom', 'es2015', 'es2017', 'es2018', 'es2019'],
    rootDir: resolve(rootDir),
    moduleResolution: ModuleResolutionKind.NodeJs,
    esModuleInterop: true,
    declaration: false,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    sourceMap,
  };

  return {
    name: 'ngc',
    buildStart: () => {
      sideEffectFreeModules = defautSideEffects(
        options?.buildOptimizer?.sideEffectFreeModules
      );
      host = createCompilerHost({
        options: {
          ...opts,
          enableIvy: 'ngtsc',
        },
      }) as CompilerHost;
      host.writeFile = (fileName: string, contents: string) =>
        files.set(fileName, contents);
    },
    resolveId: resolver(),
    async transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        return compile({
          id: resolve(id).replace(/\\/g, '/'),
          host: host as NgCompilerHost,
          options: opts,
          files,
        });
      }
      return await optimizer(code, id, {
        sideEffectFreeModules,
        angularCoreModules: options?.buildOptimizer?.angularCoreModules,
        ...opts,
      });
    },
  };
}
