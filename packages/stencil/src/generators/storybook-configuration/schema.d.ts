import { Linter } from '@nx/linter';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: Linter;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
}
