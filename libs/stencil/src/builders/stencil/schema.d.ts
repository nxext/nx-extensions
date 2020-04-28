import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilBuilderOptions extends JsonObject {
  projectType?: ProjectType;
  watch?: boolean;
  dev?: boolean;
  serve?: boolean;
}
