import { Linter } from '@nrwl/linter';

export interface Schema {
  name: string;
  tags?: string;
  directory?: string;
  unitTestRunner?: 'vitest' | 'none';
  e2eTestRunner?: 'cypress' | 'none';
  inSourceTests?: boolean;
  routing?: boolean;
  linter: Linter;
  skipFormat?: boolean;
}
export interface NormalizedSchema<T extends Schema = Schema> extends T {
  appProjectRoot: string;
  appProjectName: string;
  e2eProjectName: string;
  routing: boolean;
  projectDirectory: string;
  parsedTags: string[];
  unitTestRunner: 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  rootProject: boolean;
}
