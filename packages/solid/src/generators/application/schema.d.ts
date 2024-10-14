import { Linter } from '@nx/eslint';

export interface Schema {
  directory: string;
  name?: string;
  tags?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  rootProject?: boolean;
  host?: string;
  port?: number;
}

export interface NormalizedSchema<T extends Schema = Schema> extends T {
  projectName: string;
  appProjectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
