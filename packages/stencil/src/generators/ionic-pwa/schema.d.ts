import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';
import { Linter } from '@nx/linter';

export interface RawPWASchema {
  name: string;
  tags?: string;
  directory?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  unitTestRunner?: string;
  projectRoot?: string;
  linter?: Linter;
}

export interface PWASchema extends RawPWASchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  style: SupportedStyles;
}
