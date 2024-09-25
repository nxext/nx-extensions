export interface PageGeneratorSchema {
  name: string;
  project: string;
  directory?: string;
}

export interface NormalizedSchema extends PageGeneratorSchema {
  projectRoot: string;
  prefix: string;
}
