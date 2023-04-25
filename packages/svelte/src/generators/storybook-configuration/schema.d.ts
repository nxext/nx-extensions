import { Linter } from '@nx/linter';

export interface StorybookConfigureSchema {
  name: string;
  configureCypress?: boolean;
  linter?: Linter;
  js?: boolean;
  cypressDirectory?: string;
  standaloneConfig?: boolean;
  tsConfiguration?: boolean;
  configureTestRunner?: boolean;
}
