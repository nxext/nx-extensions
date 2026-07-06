import { LinterType } from '@nx/eslint';

export interface PreactLibrarySchema {
  directory: string;
  name?: string;
  tags?: string;
  linter: LinterType;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  buildable?: boolean;
  publishable?: boolean;
  importPath?: string;
  skipFormat: boolean;
}

export interface NormalizedSchema extends PreactLibrarySchema {
  projectName: string;
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
