import { JsonObject } from '@angular-devkit/core';

export interface RawSvelteBuildOptions extends JsonObject {
  outputPath: string;
  tsConfig: string;
  entryFile: string;
  external?: string[];
  assets?: string[];

  watch?: boolean;
  serve?: boolean;
  prod?: boolean;
  open?: boolean;

  host?: string;
  port?: number;

  rollupConfig?: string;
}

export interface SvelteBuildOptions extends RawSvelteBuildOptions {
  projectName: string;
  projectRoot: string;
  workspaceRoot: string;
  sourceRoot: string;
  assets: string[];
}
