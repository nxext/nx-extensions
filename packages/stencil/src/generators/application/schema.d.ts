import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';
import { LinterType } from '@nx/eslint';

export interface RawApplicationSchema {
  directory: string;
  name?: string;
  tags?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  unitTestRunner?: string;
  projectRoot?: string;
  linter?: LinterType;
  importPath?: string;
}

export interface ApplicationSchema extends RawApplicationSchema {
  name: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  style: SupportedStyles;
  importPath: string;
  /**
   * Always the plain, scope-free directory-derived project name - even when
   * `name`/`projectName` become the full scoped `importPath` in TS-solution
   * mode (Design 1.5). Used for Stencil's own generated values (namespace,
   * cosmetic dev-server URL) that must never contain the npm scope.
   */
  simpleProjectName: string;
  isUsingTsSolutionConfig: boolean;
  /** Default (mirrors @nxext/svelte/@nxext/sveltekit): `!isUsingTsSolutionConfig`. */
  useProjectJson: boolean;
}
