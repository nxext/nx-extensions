import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';
import { ProjectType } from '../../utils/typings';

export interface StencilE2EOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;
}
