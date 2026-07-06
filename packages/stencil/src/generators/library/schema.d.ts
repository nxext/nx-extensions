import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';
import { LinterType } from '@nx/eslint';

export interface RawLibrarySchema {
  directory: string;
  name?: string;
  tags?: string;
  skipFormat?: boolean;
  buildable: boolean;
  publishable: boolean;
  importPath?: string;
  style?: SupportedStyles;
  e2eTestRunner?: string;
  unitTestRunner?: string;
  linter?: LinterType;
  component?: boolean;
}

export interface LibrarySchema extends RawLibrarySchema {
  name: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  appType: AppType;
  parsedTags: string[];
  importPath: string;
  /**
   * Always the plain, scope-free directory-derived project name - even when
   * `name`/`projectName` become the full scoped `importPath` in TS-solution
   * mode (Design 1.5). Used for Stencil's own generated `namespace` value,
   * which must never contain the npm scope.
   */
  simpleProjectName: string;
  isUsingTsSolutionConfig: boolean;
  /** Default (mirrors @nxext/svelte/@nxext/sveltekit): `!isUsingTsSolutionConfig`. */
  useProjectJson: boolean;
}
