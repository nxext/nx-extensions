import { JsonObject } from '@angular-devkit/core';

export interface Schema extends JsonObject {
  targets: string[];
  jestConfig: string;
}
