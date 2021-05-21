import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';

export interface RawApplicationSchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  projectRoot?: string;
}

export interface ApplicationSchema extends RawApplicationSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
}
