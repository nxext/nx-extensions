import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';

export interface LibrarySchema {
  name: string;
  tags?: string;
  directory?: string;
  skipFormat?: boolean;
  buildable: boolean;
  publishable: boolean;
  importPath?: string;
  style?: SupportedStyles;
}

export interface NormalizedLibrarySchema extends LibrarySchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  appType: AppType;
  parsedTags: string[];
}
