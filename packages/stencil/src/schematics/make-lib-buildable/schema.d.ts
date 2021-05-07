import { SupportedStyles } from '../../stencil-core-utils';
import { InitSchema } from '../../generators/init/schema';

export interface MakeLibBuildableSchema extends InitSchema {
  style: SupportedStyles;
  importPath: string
}
