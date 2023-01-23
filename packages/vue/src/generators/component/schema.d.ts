export interface Schema {
  name: string;
  project: string;
  directory?: string;
  inSourceTests?: boolean;
  skipTests?: boolean;
  export?: boolean;
}
