import { Config } from '@stencil/core/cli';

export type CoreCompiler = typeof import('@stencil/core/compiler');

export type ConfigAndPathCollection = {
  config: Config;
  distDir: string;
  coreCompiler: CoreCompiler;
  projectRoot: string;
  projectName: string;
  pkgJson: string;
};

export interface ConfigAndCoreCompiler {
  config: Config;
  coreCompiler: CoreCompiler;
}
