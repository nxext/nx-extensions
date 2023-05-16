import { Linter } from '@nx/linter';

export interface PreactApplicationSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  host?: string;
  port?: number;
}

export interface NormalizedSchema extends PreactApplicationSchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
