import { ProjectType } from '@nrwl/workspace';
import { StencilBaseConfigOptions } from '../stencil-runtime/stencil-config';

export interface StencilBuildOptions extends StencilBaseConfigOptions {
  projectType?: ProjectType;

  // Stencil compiler Options
  ci?: boolean;
  debug?: boolean;
  dev?: boolean;
  docsReadme?: boolean;
  es5?: boolean;
  log?: boolean;
  prerender?: boolean;
  prod?: boolean;
  maxWorkers?: number;
  port?: number;
  serve?: boolean;
  verbose?: boolean;
  watch?: boolean;
  noOpen?: boolean;
}
