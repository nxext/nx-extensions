import { Linter } from '@nx/linter';

export interface TsEdLibrarySchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  directory?: string;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends TsEdLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
