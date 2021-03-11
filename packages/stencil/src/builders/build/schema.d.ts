import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilBuildOptions extends JsonObject {
  projectType?: ProjectType;
  configPath: string;

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
