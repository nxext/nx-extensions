import { AppType, SupportedStyles } from '../../utils/typings';
import { InitSchema } from '../init/schema';

export interface IonicAppSchema extends InitSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
  appTemplate: string;
  npmClient?: 'npm' | 'yarn';
}
