import type { Plugin, ResolvedConfig } from 'vite';
import { AngularVitePluginOptions } from './plugin-options';
import { AngularVitePlugin } from './angular-vite-plugin';
import { resolver } from './resolver';
import { defautSideEffects, optimizer } from './utils/optimizer';

export function AngularPlugin(options?: AngularVitePluginOptions): Plugin {
  console.log('options', options);
  let configResolved: ResolvedConfig;

  let sideEffectFreeModules: string[];
  let angularVite: AngularVitePlugin;

  return {
    name: 'vite-plugin-angular-vite-host-by-nxext',
    configResolved(config: ResolvedConfig) {
      configResolved = config;
    },
    buildStart: async () => {
      sideEffectFreeModules = defautSideEffects(
        options?.buildOptimizer?.sideEffectFreeModules
      );
      angularVite = new AngularVitePlugin(options, configResolved);
      await angularVite.initializeCompilerCli();
    },
    resolveId: resolver(),
    async transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        return angularVite.transform(code, id);
      }
      return await optimizer(code, id, {
        sideEffectFreeModules,
        angularCoreModules: options?.buildOptimizer?.angularCoreModules,
      });
    },
  };
}
