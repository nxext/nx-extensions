import { JsonObject, Path } from '@angular-devkit/core';
import { NormalizedCopyAssetOption } from '../utils/normalize';

export interface RawSvelteBuildOptions extends JsonObject {
  outputPath: string;
  tsConfig: string;
  entryFile: string;
  external?: string[];
  assets?: string[];
  project: string;

  watch?: boolean;
  serve?: boolean;
  prod?: boolean;
  open?: boolean;

  host?: string;
  port?: number;

  rollupConfig?: Path;
  sveltePreprocessConfig?: Path;
}

export interface SvelteBuildOptions extends RawSvelteBuildOptions {
  projectName: string;
  projectRoot: string;
  workspaceRoot: string;
  sourceRoot: Path;
  assets: NormalizedCopyAssetOption[];
}
