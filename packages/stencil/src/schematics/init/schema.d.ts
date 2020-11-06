import { AppType, SupportedStyles } from '../../utils/typings';

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
