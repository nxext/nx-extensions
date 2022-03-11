import { AngularVitePluginOptions } from './plugin-options';
import { Plugin } from 'vite';
import { transform, plugins, Program } from '@swc/core';
import {
  AngularComponents,
  AngularImportCompilerComponents,
  AngularInjector,
  AngularSwapPlatformDynamic,
} from '@nxext/angular-swc';
// import { defautSideEffects, optimizer } from './utils/optimizer';

export function ViteAngularPlugin(
  angularOptions?: AngularVitePluginOptions
): Plugin {
  let angularComponentPlugin: AngularComponents;
  let angularInjectorPlugin: AngularInjector;
  let isProduction = true;
  // let isBuild = false;
  // let sideEffectFreeModules: string[];
  // eslint-disable-next-line no-useless-escape
  const fileExtensionRE = /\.[^\/\s\?]+$/;
  return {
    name: 'vite-plugin-angular-by-nxext',
    enforce: 'pre',
    configResolved(config) {
      isProduction = config.isProduction;
      // isBuild = config.command === 'build';
    },
    buildStart: async () => {
      // sideEffectFreeModules = defautSideEffects(
      //   angularOptions?.buildOptimizer?.sideEffectFreeModules
      // );
    },
    transform: (code, id) => {
      const [filepath, querystring = ''] = id.split('?');
      const [extension = ''] =
        querystring.match(fileExtensionRE) ||
        filepath.match(fileExtensionRE) ||
        [];

      // if (id.includes('node_modules')) {
      //   return isBuild
      //     ? optimizer(code, id, {
      //         sideEffectFreeModules,
      //         angularCoreModules:
      //           angularOptions?.buildOptimizer?.angularCoreModules,
      //       })
      //     : { code };
      // }

      if (!/\.(js|ts|tsx|jsx?)$/.test(extension)) {
        return;
      }

      return transform(code, {
        sourceMaps: true,
        jsc: {
          target: angularOptions?.target ?? 'es2020',
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: true,
            dynamicImport: true,
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true,
          },
          minify: {
            compress: {
              unused: true,
              dead_code: true,
            },
            ecma: '2016',
            module: true,
            mangle: true,
          },
        },
        minify: true,
        module: {
          type: 'es6',
          lazy: true,
        },
        plugin: plugins([
          (m: Program) => {
            angularComponentPlugin = new AngularComponents({
              sourceUrl: id,
              styleUrls: angularOptions?.component?.styleUrls,
              templateUrl: angularOptions?.component?.templateUrl,
            });
            return angularComponentPlugin.visitProgram(m);
          },
          (m: Program) => {
            angularInjectorPlugin = new AngularInjector();
            return angularInjectorPlugin.visitProgram(m);
          },
          (m: Program) => {
            return new AngularImportCompilerComponents().visitProgram(m);
          },
          ...(angularOptions?.swc?.plugins ?? []),
          ...(isProduction
            ? [(m: Program) => new AngularSwapPlatformDynamic().visitProgram(m)]
            : []),
        ]),
      }).then((res) => {
        return {
          code: res.code,
          map: res.map,
        };
      });
    },
  };
}
