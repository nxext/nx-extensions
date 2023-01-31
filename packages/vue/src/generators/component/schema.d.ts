export interface Schema {
  name: string;
  project: string;
  directory?: string;
  skipTests?: boolean;
  export?: boolean;
}

interface NormalizedSchema extends Schema {
  projectRoot: string;
  projectSourceRoot: string;
  fileName: string;
}
