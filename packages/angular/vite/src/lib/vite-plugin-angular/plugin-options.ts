import type { JscTarget, Plugin } from '@swc/core';
import { OptimizerOptions } from './utils/optimizer';
import { AngularComponentOptions } from '@nxext/angular-swc';
export interface AngularVitePluginOptions {
  target: JscTarget;
  buildOptimizer?: OptimizerOptions;
  /**
   * @summary This is an experiment plugin system. It could be removed or change at any time
   */
  component?: Omit<AngularComponentOptions, 'sourceUrl'>;
  /**
   * @summary This is an experiment plugin system. It could be removed or change at any time
   */
  swc?: {
    plugins: Plugin[];
  };
}
