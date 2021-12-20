/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path';
import { ModuleKind, ScriptTarget, CompilerOptions } from 'typescript';

import { resolver } from './resolver';
import { compile } from './compile';
import { optimizer, defautSideEffects, OptimizerOptions } from './optimizer';
import type {
  CompilerHost,
  CompilerOptions as NgCompilerOptions,
} from '@angular/compiler-cli';
import type { Plugin, ResolvedConfig } from 'vite';
import * as ts from 'typescript';

export interface Options {
  rootDir?: string;
  sourceMap?: boolean;
  target?: ScriptTarget;
  buildOptimizer?: OptimizerOptions;
}

function ngcPlugin(options: Options = {}): Plugin {
  let host: CompilerHost, sideEffectFreeModules: string[];

  const files = new Map();
  const {
    target = ScriptTarget.ESNext,
    rootDir = 'src',
    sourceMap = true,
  } = options;

  const opts: CompilerOptions = {
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
  let configResolved: ResolvedConfig;
  let compilerModule: typeof import('@angular/compiler-cli');

  return {
    name: 'nxext-angular',
    configResolved(config: ResolvedConfig) {
      configResolved = config;
    },
    buildStart: async () => {
      compilerModule = await new Function(
        `return import('@angular/compiler-cli');`
      )();
      sideEffectFreeModules = defautSideEffects(
        options?.buildOptimizer?.sideEffectFreeModules
      );

      host = compilerModule.createCompilerHost({
        options: opts as NgCompilerOptions,
      });
      (host as ts.CompilerHost).writeFile = (
        fileName: string,
        contents: string
      ) => files.set(fileName, contents);
    },
    resolveId: resolver(),
    async transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        return await compile({
          id: resolve(id).replace(/\\/g, '/'),
          host: host,
          options: opts,
          files,
          configResolved,
          compilerModule,
        });
      }
      return await optimizer(code, id, {
        sideEffectFreeModules,
        angularCoreModules: options?.buildOptimizer?.angularCoreModules,
      });
    },
  };
}

module.exports = ngcPlugin;
