import { SupportedStyles } from '../../stencil-core-utils';
import { InitSchema } from '../../generators/init/schema';

export interface MakeLibBuildableSchema extends InitSchema {
  style: SupportedStyles;

  /**
   * The TS `paths` entry to be used across Nx projects.
   *
   * If no value is set, defaults to Nx workspace name followed by Nx project name.
   */
  importPath?: string;
}
