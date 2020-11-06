import { AppType, SupportedStyles } from './../../utils/typings';
import { InitSchema } from '../init/schema';

export interface LibrarySchema extends InitSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  buildable: boolean;
  appType: AppType;
  style: SupportedStyles;
}
