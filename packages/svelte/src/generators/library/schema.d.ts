import { Linter } from '@nx/linter';

export interface SvelteLibrarySchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  directory?: string;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends SvelteLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
