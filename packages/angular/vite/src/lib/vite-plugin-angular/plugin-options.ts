import type { JscTarget } from '@swc/core';
import { OptimizerOptions } from './utils/optimizer';

export interface AngularVitePluginOptions {
  target: JscTarget;
  buildOptimizer?: OptimizerOptions;
}
