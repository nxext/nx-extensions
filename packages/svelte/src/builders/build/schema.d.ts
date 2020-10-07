import { JsonObject } from '@angular-devkit/core';

export interface SvelteBuildOptions extends JsonObject {
  outputPath: string;
  tsConfig: string;
  entryFile: string;
  external?: string[];
  assets?: string[];

  watch?: boolean;
  serve?: boolean;
  dev?: boolean;
  open?: boolean;
}

export interface NormalizedSvelteBuildOptions extends SvelteBuildOptions {
  projectName: string;
  projectRoot: string;
  workspaceRoot: string;
  sourceRoot: string;
  assets: string[];
}
