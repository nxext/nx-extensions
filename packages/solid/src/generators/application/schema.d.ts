import { Linter } from '@nx/eslint';
import { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface Schema {
  name: string;
  tags?: string;
  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  rootProject?: boolean;
  host?: string;
  port?: number;
}

export interface NormalizedSchema<T extends Schema = Schema> extends T {
  projectName: string;
  appProjectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
