import { AppType, SupportedStyles } from './../../utils/typings';
import { CoreSchema } from '../core/schema';

export interface LibrarySchema extends CoreSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  buildable: boolean;
  appType: AppType;
  style: SupportedStyles;
}
