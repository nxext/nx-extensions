import { Linter } from '@nx/eslint';

export interface SvelteLibrarySchema {
  directory: string;
  name?: string;
  tags?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
  simpleName?: boolean;
}

export interface NormalizedSchema extends SvelteLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
