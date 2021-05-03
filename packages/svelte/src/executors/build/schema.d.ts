import { NormalizedCopyAssetOption } from '../utils/normalize';

export interface RawSvelteBuildOptions {
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
  sveltePreprocessConfig?: string;
  svelteConfig?: string;
  project: string;
  extractCss?: boolean;
  headers: HeaderParam[];
}

export type Header = {[key: string]: string};

export interface SvelteBuildOptions extends RawSvelteBuildOptions {
  assets: NormalizedCopyAssetOption[];
  entryRoot: string;
  projectRoot: string;
}
