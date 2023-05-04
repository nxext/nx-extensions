import { InitSchema } from '../../generators/init/schema';

export interface MakeLibBuildableSchema
  extends Pick<InitSchema, 'name' | 'style' | 'projectRoot'> {
  /**
   * The TS `paths` entry to be used across Nx projects.
   *
   * Defaults to: ampersand, Nx workspace name, forward-slash and finally Nx library name. Such as:
   * `@nx-workspace/nx-library`
   */
  importPath?: string;
}
