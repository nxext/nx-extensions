import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';
import { ProjectType } from '../../utils/typings';

export interface StencilTestOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;
  watch?: boolean;
}
