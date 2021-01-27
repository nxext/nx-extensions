import { Config } from '@stencil/core/cli';
import { Path } from '@angular-devkit/core';

export type CoreCompiler = typeof import('@stencil/core/compiler');

export type ConfigAndPathCollection = {
  config: Config;
  distDir: Path;
  coreCompiler: CoreCompiler;
  projectRoot: Path;
  projectName: string;
  pkgJson: string;
};

export interface ConfigAndCoreCompiler {
  config: Config;
  coreCompiler: CoreCompiler;
}
