import { AssetGlob } from '@nx/workspace/src/utilities/assets';

export interface Schema {
  entryFile: string;
  configFile?: string;
  assets?: Array<AssetGlob | string>;
  packageJson?: string;
  outputPath: string;
  frameworkConfigFile?: string;
  globals?: Record<string, string>;
  external?: string[];
}
