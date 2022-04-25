export interface DevExecutorSchema {
  configFile?: string;
  baseHref?: string;
  fileReplacements?: { file: string; with: string }[];
  proxyConfig?: string;
  frameworkConfigFile?: string;
  outputPath: string;
}
