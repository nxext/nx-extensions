import { Linter } from '@nx/eslint';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: Linter;
  js?: boolean;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
  tsConfiguration?: boolean;
  interactionTests?: boolean;
}
