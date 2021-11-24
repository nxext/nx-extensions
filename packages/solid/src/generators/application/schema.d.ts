import { Linter } from '@nrwl/linter';

export interface SolidApplicationSchema {
  name: string;
  tags?: string;

  linter: Linter;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  host?: string;
  port?: number;
  bundler?: 'vite';
}

export interface NormalizedSchema extends SolidApplicationSchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
