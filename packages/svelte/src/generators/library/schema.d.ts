import { LinterType } from '@nx/eslint';

export interface SvelteLibrarySchema {
  directory: string;
  name?: string;
  tags?: string;
  linter: LinterType;
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
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
  /** Single source of truth for the TS-solution branch, computed once in `normalizeOptions`. */
  isUsingTsSolutionConfig: boolean;
  /** Default `!isUsingTsSolutionConfig` (Nx pattern, not exposed as a CLI flag here). */
  useProjectJson: boolean;
}
