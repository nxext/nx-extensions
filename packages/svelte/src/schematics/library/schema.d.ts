import { Linter } from '@nrwl/linter';

export interface SvelteLibrarySchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
}

export interface NormalizedSchema extends SvelteLibrarySchema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  skipFormat: boolean;
}
