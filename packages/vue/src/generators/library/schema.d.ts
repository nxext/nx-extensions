export interface Schema {
  name: string;
  tags?: string;
  directory?: string;
  unitTestRunner?: 'vitest' | 'none';
  e2eTestRunner?: 'cypress' | 'none';
  linter: Linter;
  inSourceTests?: boolean;
  publishable?: boolean;
  buildable?: boolean;
  importPath?: string;
  component?: boolean;
  skipFormat?: boolean;
}

export interface NormalizedSchema<T extends Schema = Schema> extends T {
  projectName: string;
  projectRoot: string;
  e2eProjectName: string;
  projectDirectory: string;
  parsedTags: string[];
  fileName: string;
  unitTestRunner: 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
}
