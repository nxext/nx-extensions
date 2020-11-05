import { CoreSchema } from '../core/schema';
import { AppType, SupportedStyles } from '../../utils/typings';

export interface IonicAppSchema extends CoreSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
  appTemplate: string;
}
