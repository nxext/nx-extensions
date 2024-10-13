import { Linter } from '@nx/eslint';

export interface Schema {
  directory: string;
  name?: string;
  tags?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  host?: string;
  port?: number;
  rootProject?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
