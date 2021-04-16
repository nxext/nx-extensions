import { ProjectType } from '@nrwl/workspace';
import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';

export interface StencilTestOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;
  watch?: boolean;
}
