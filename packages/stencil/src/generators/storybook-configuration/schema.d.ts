import { Linter } from '@nrwl/linter';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: Linter;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
}
