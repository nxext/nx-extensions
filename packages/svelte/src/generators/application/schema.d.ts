import { Linter } from '@nx/linter';
import { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface Schema {
  name: string;
  tags?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  linter: Linter;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  directory?: string;
  host?: string;
  port?: number;
  rootProject?: boolean;
}

export interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  fileName: string;
  parsedTags: string[];
  skipFormat: boolean;
}
