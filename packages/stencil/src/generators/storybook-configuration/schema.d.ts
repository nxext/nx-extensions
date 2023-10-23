import { Linter } from '@nx/eslint';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: Linter;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
}
