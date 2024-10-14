import { AppType } from './../../utils/typings';
import { SupportedStyles } from '../../stencil-core-utils';
import { Linter } from '@nx/eslint';

export interface RawApplicationSchema {
  directory: string;
  name?: string;
  tags?: string;
  style?: SupportedStyles;
  skipFormat?: boolean;
  appType?: AppType;
  e2eTestRunner?: string;
  unitTestRunner?: string;
  projectRoot?: string;
  linter?: Linter;
}

export interface ApplicationSchema extends RawApplicationSchema {
  name: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  appType: AppType;
  e2eProjectName: string;
  e2eProjectRoot: string;
  e2eWebServerAddress: string;
  e2eWebServerTarget: string;
  style: SupportedStyles;
}
