import type { CompilerOptions } from '@angular/compiler-cli';
import { OptimizerOptions } from './utils/optimizer';

export interface AngularVitePluginOptions {
  tsconfig: string;
  compilerOptions?: CompilerOptions;
  substitutions: Record<string, string>;
  directTemplateLoading: boolean;
  emitClassMetadata: boolean;
  emitNgModuleScope: boolean;
  jitMode: boolean;
  inlineStyleFileExtension?: string;
  buildOptimizer?: OptimizerOptions;
}
