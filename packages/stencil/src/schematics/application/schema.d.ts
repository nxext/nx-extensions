import { AppType, SupportedStyles } from './../../utils/typings';
import { InitSchema } from '../init/schema';

export interface ApplicationSchema extends InitSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
}
