import { AngularVitePluginOptions } from './plugin-options';
import { Plugin } from 'vite';
import { transform, plugins } from '@swc/core';
import { AngularComponents } from './swc-plugin/components';
import { resolver } from './resolver';
import { AngularInjector } from './swc-plugin/injector';

export function ViteAngularPlugin(
  angularOptions?: AngularVitePluginOptions
): Plugin {
  let isDevelopment = false;
  let angularComponentPlugin: AngularComponents;
  let angularInjectorPlugin: AngularInjector;
  return {
    name: 'vite-plugin-angular-by-nxext',
    enforce: 'pre',
    config(config, env) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      isDevelopment = env.mode === 'development';
      // Disable esbuild for transforming
      config.esbuild = false;
    },
    resolveId: resolver(),
    transform: (code, id) => {
      if (id.includes('node_modules') && !id.includes('node_modules/vite/')) {
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
