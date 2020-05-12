import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilTestOptions extends JsonObject {
  projectType?: ProjectType;
  watch?: boolean;
}
