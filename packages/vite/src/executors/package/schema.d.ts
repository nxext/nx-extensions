export interface Schema {
  entryFile: string;
  configFile?: string;
  assets?: string;
  packageJson?: string;
  outputPath: string;
  globals?: Record<string, string>;
  external?: string[];
}
