export interface BuildExecutorSchema {
  configFile?: string;
  baseHref?: string;
  fileReplacements?: { file: string; with: string }[];
}
