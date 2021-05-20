import { AppType } from './../../utils/typings';
import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';

export interface ApplicationSchema extends InitSchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  projectRoot?: string;

  projectName: string;
  projectDirectory: string;
  parsedTags: string[];
}
