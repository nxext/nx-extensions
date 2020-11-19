import { AppType } from '../../utils/typings';
import { SupportedStyles } from '@nxext/stencil-core-utils';

export interface InitSchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  projectRoot?: string;
}
