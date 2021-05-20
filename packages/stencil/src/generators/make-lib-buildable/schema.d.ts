import { SupportedStyles } from '../../stencil-core-utils';
import { InitSchema } from '../../generators/init/schema';

export interface MakeLibBuildableSchema {
  name: string;
  style: SupportedStyles;
  importPath: string;
}

export interface NormalizedMakeLibBuildableSchema extends MakeLibBuildableSchema {
  projectRoot: string
}
