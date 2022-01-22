import { AngularVitePluginOptions } from './plugin-options';
import { Plugin } from 'vite';
import { transform, plugins } from '@swc/core';
import { AngularComponents } from './swc-plugin/components';
import { AngularInjector } from './swc-plugin/injector';

export function ViteAngularPlugin(
  angularOptions?: AngularVitePluginOptions
): Plugin {
  let angularComponentPlugin: AngularComponents;
  let angularInjectorPlugin: AngularInjector;
  // eslint-disable-next-line no-useless-escape
  const fileExtensionRE = /\.[^\/\s\?]+$/;
  return {
    name: 'vite-plugin-angular-by-nxext',
    enforce: 'pre',
    config(config) {
      config.esbuild = false;
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
        return {
          code,
        };
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
        ]),
      }).then((res) => {
        return {
          code: `
            ${
              !angularInjectorPlugin.hasInjectorImport &&
              angularInjectorPlugin.hasInjectedConstructor
                ? "import { Injector } from '@angular/core';\r\n"
                : ''
            }
            ${angularComponentPlugin.getMissingImports().join('\r\n')}
            ${res.code}
          `,
          map: res.map,
        };
      });
    },
  };
}
