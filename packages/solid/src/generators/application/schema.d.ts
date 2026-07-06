import { LinterType } from '@nx/eslint';

export interface Schema {
  directory: string;
  name?: string;
  tags?: string;
  linter: LinterType;
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
  /** npm-scoped import path, e.g. `@proj/my-app` (see `@nxext/common`'s `normalizeViteAppCore`). */
  importPath: string;
  /** Single source of truth for the TS-solution branch, computed once in `normalizeOptions`. */
  isUsingTsSolutionConfig: boolean;
  /** Default `!isUsingTsSolutionConfig` (Nx pattern, not exposed as a CLI flag here). */
  useProjectJson: boolean;
}
