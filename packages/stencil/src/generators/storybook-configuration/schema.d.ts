import { LinterType } from '@nx/eslint';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: LinterType;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
  interactionTests?: boolean;
}
