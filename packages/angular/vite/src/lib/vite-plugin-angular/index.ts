import { AngularVitePluginOptions } from './plugin-options';
import { Plugin } from 'vite';
import { transform, plugins, Program } from '@swc/core';
import {
  AngularComponents,
  AngularImportCompilerComponents,
  AngularInjector,
  AngularSwapPlatformDynamic,
  FileSystem,
} from '@nxext/angular-swc';

export function ViteAngularPlugin(
  angularOptions?: AngularVitePluginOptions
): Plugin {
  let fileSystem: FileSystem;
  let isProduction = false;
  const fileExtensionRE = /\.[^/\s?]+$/;
  return {
    name: 'vite-plugin-angular-by-nxext',
    enforce: 'pre',
    configResolved(config) {
      isProduction = config.isProduction;
    },
    buildStart: async () => {
      fileSystem = new FileSystem();
    },
    transform: (code, id) => {
      const [filepath, querystring = ''] = id.split('?');
      const [extension = ''] =
        querystring.match(fileExtensionRE) ||
        filepath.match(fileExtensionRE) ||
        [];

      if (id.includes('node_modules')) {
        return code;
      }

      if (!/\.(js|ts|tsx|jsx?)$/.test(extension)) {
        const internalFile = fileSystem.findFileByInternalFile(code);
        if (internalFile) {
          fileSystem.touchFile(internalFile);
        }
        return;
      }

      return transform(code, {
        sourceMaps: !isProduction,
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
            compress: isProduction
              ? {
                  unused: true,
                  dead_code: true,
                }
              : false,
            ecma: '2016',
            module: true,
            mangle: isProduction,
          },
        },
        minify: isProduction,
        module: {
          type: 'es6',
          lazy: true,
        },
        plugin: plugins([
          (m: Program) => {
            const angularComponentPlugin = new AngularComponents({
              sourceUrl: id,
              styleUrls: angularOptions?.component?.styleUrls,
              templateUrl: angularOptions?.component?.templateUrl,
              fileSystem: fileSystem,
            });
            return angularComponentPlugin.visitProgram(m);
          },
          (m: Program) => {
            const angularInjectorPlugin = new AngularInjector();
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
