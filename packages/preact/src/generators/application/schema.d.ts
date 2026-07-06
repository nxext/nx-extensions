import { LinterType } from '@nx/eslint';

export interface PreactApplicationSchema {
  directory: string;
  name?: string;
  tags?: string;
  linter: LinterType;
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
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
  /** npm-scoped import path, e.g. `@proj/my-app` (see `@nxext/common`'s `normalizeViteAppCore`). */
  importPath: string;
  /** Single source of truth for the TS-solution branch, computed once in `normalizeOptions`. */
  isUsingTsSolutionConfig: boolean;
  /** Default `!isUsingTsSolutionConfig` (Nx pattern, not exposed as a CLI flag here). */
  useProjectJson: boolean;
}
