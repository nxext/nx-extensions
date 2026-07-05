import { LinterType } from '@nx/eslint';

export interface StorybookConfigureSchema {
  name: string;
  linter?: LinterType;
  js?: boolean;
  standaloneConfig?: boolean;
  tsConfiguration?: boolean;
  interactionTests?: boolean;
}
