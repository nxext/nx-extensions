import { Linter } from '@nx/eslint';

export interface StorybookConfigureSchema {
  name: string;
  linter?: Linter;
  js?: boolean;
  standaloneConfig?: boolean;
  tsConfiguration?: boolean;
  interactionTests?: boolean;
}
