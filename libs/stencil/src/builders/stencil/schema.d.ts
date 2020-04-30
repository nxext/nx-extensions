import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilBuilderOptions extends JsonObject {
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
}
