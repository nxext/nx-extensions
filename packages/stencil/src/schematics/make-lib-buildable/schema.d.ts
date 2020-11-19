import { InitSchema } from '../init/schema';
import { SupportedStyles } from '@nxext/stencil-core-utils';

export interface MakeLibBuildableSchema extends InitSchema {
  style: SupportedStyles;
}
