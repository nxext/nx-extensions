import { Linter } from '@nx/linter';

export interface SolidLibrarySchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  directory?: string;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends SolidLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
