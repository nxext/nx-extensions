import { AppType } from '../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';

export interface InitSchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  unitTestRunner?: string;
  projectRoot?: string;
}
