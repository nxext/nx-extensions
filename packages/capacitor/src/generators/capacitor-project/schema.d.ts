export interface CapacitorGeneratorSchema {
  project: string;
  appId: string;
  appName?: string;
  webDir?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends CapacitorGeneratorSchema {
  projectRoot: string;
  pathToRoot: string;
}
