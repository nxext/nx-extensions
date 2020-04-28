import { AppType, SupportedStyles } from './../../utils/typings';
import { CoreSchema } from '../core/schema';

export interface PWASchema extends CoreSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
}
