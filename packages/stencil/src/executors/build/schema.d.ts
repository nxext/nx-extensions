import { ProjectType } from '@nrwl/workspace';
import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';

export interface StencilBuildOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;

  // Stencil compiler Options
  ci?: boolean;
  debug?: boolean;
  dev?: boolean;
  docs?: boolean;
  port?: number;
  serve?: boolean;
  verbose?: boolean;
  watch?: boolean;
  prerender?: boolean;
  ssr?: boolean;
}
