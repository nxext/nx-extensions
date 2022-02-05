import { AngularVitePluginOptions } from './plugin-options';
import { Plugin } from 'vite';
import { transform, plugins } from '@swc/core';
import { AngularComponents } from './swc-plugin/components';
import { AngularInjector } from './swc-plugin/injector';
import { AngularImportCompilerComponents } from './swc-plugin/auto-import-compilier';
import { AngularSwapPlatformDynamic } from './swc-plugin/swap-dynamic-import';

export function ViteAngularPlugin(
  angularOptions?: AngularVitePluginOptions
): Plugin {
  let angularComponentPlugin: AngularComponents;
  let angularInjectorPlugin: AngularInjector;
  let isProduction = true;
  // eslint-disable-next-line no-useless-escape
  const fileExtensionRE = /\.[^\/\s\?]+$/;
  return {
    name: 'vite-plugin-angular-by-nxext',
    enforce: 'pre',
    configResolved(config) {
      isProduction = config.isProduction;
    },
    transform: (code, id) => {
      const [filepath, querystring = ''] = id.split('?');
      const [extension = ''] =
        querystring.match(fileExtensionRE) ||
        filepath.match(fileExtensionRE) ||
        [];

      if (/\.(html?)$/.test(extension)) {
        return;
      }

      if (
        (id.includes('node_modules') && !id.includes('node_modules/vite/')) ||
        !/\.(mjs|[tj]s?)$/.test(extension)
      ) {
        return { code };
      }
      return transform(code, {
        sourceMaps: true,
        jsc: {
          target: angularOptions.target,
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
        },
        plugin: plugins([
          (m) => {
            angularComponentPlugin = new AngularComponents(id);
            return angularComponentPlugin.visitProgram(m);
          },
          (m) => {
            angularInjectorPlugin = new AngularInjector();
            return angularInjectorPlugin.visitProgram(m);
          },
          (m) => {
            return new AngularImportCompilerComponents().visitProgram(m);
          },
          ...(isProduction
            ? [(m) => new AngularSwapPlatformDynamic().visitProgram(m)]
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
