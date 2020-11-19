import { AppType } from './../../utils/typings';
import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';

export interface ApplicationSchema extends InitSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
}
