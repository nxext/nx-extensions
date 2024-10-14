import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';
import { Linter } from '@nx/eslint';

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
  linter?: Linter;
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
