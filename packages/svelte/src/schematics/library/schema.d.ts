import { Linter } from '@nrwl/workspace';

export interface SvelteSchematicSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
}

export interface NormalizedSchema extends SvelteSchematicSchema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  skipFormat: boolean;
}
