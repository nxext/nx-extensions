import { JsonObject } from '@angular-devkit/core';
import { ProjectType } from '@nrwl/workspace';

export interface StencilE2EOptions extends JsonObject {
  projectType?: ProjectType;
}
