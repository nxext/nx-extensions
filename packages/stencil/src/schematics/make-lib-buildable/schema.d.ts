import { InitSchema } from '../init/schema';
import { SupportedStyles } from '../../stencil-core-utils';

export interface MakeLibBuildableSchema extends InitSchema {
  style: SupportedStyles;
  importPath: string
}
