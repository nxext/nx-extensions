import { AppType, SupportedStyles } from '../../utils/typings';

export interface CoreSchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
}
