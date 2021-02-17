import { Linter } from '@nrwl/workspace';

export interface SvelteApplicationSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';

  host?: string;
  port?: number;
}

export interface NormalizedSchema extends SvelteApplicationSchema {
  projectName: string;
  projectRoot: string;
  parsedTags: string[];
  skipFormat: boolean;
}
