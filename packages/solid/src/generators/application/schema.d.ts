import { Linter } from '@nrwl/linter';

export interface Schema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  inSourceTests?: boolean;
  host?: string;
  port?: number;
  rootProject?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  appProjectRoot: string;
  e2eProjectName: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
