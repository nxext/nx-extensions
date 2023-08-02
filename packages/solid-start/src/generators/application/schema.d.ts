import { Linter } from '@nx/linter';

export interface SolidApplicationSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  host?: string;
  port?: number;
}

export interface NormalizedSchema extends SolidApplicationSchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
