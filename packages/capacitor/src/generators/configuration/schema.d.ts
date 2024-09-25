export interface CapacitorConfigurationSchema {
  project: string;
  appId: string;
  appName?: string;
  webDir?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends CapacitorConfigurationSchema {
  projectRoot: string;
  pathToRoot: string;
}
