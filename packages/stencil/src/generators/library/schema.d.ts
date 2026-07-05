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
}
