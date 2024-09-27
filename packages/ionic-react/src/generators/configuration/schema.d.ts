export interface ConfigurationGeneratorSchema {
  project: string;
  capacitor: boolean;
  skipFormat: boolean;
}

export interface NormalizedSchema extends ConfigurationGeneratorSchema {
  projectRoot: string;
}
