import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';

export interface RawLibrarySchema {
  name: string;
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
  buildable: boolean;
  publishable: boolean;
  importPath?: string;
  style?: SupportedStyles;
  e2eTestRunner?: string;
  unitTestRunner?: string;
}

export interface LibrarySchema extends RawLibrarySchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  appType: AppType;
  parsedTags: string[];
}
