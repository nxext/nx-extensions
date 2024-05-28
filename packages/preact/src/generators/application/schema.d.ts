import { Linter } from '@nx/eslint';

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
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  parsedTags: string[];
  skipFormat: boolean;
}
