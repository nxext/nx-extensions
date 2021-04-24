import { ProjectType } from '@nrwl/workspace';
import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';

export interface StencilE2EOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;
}
