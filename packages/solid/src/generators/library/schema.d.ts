import { Linter } from '@nx/eslint';

export interface SolidLibrarySchema {
  directory: string;
  name?: string;
  tags?: string;
  linter: Linter;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
  simpleName?: boolean;
}

export interface NormalizedSchema extends SolidLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
  inSourceTests: boolean;
}
