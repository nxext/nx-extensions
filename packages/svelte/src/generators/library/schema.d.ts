import { Linter } from '@nx/eslint';
import { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface SvelteLibrarySchema {
  name: string;
  tags?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  linter: Linter;
  unitTestRunner: 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  directory?: string;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
  simpleName?: boolean;
}

export interface NormalizedSchema extends SvelteLibrarySchema {
  projectRoot: string;
  projectDirectory: string;
  fileName: string;
  parsedTags: string[];
  importPath: string;
}
