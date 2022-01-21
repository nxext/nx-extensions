import type { CompilerOptions } from '@angular/compiler-cli';
import type { JscTarget } from '@swc/core';

export interface AngularVitePluginOptions {
  tsconfig: string;
  compilerOptions?: Omit<CompilerOptions, 'target'>;
  substitutions: Record<string, string>;
  directTemplateLoading: boolean;
  emitClassMetadata: boolean;
  emitNgModuleScope: boolean;
  jitMode: boolean;
  inlineStyleFileExtension?: string;
  target: JscTarget;
}
