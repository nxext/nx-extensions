import { Linter } from '@nx/eslint';

export interface StorybookConfigurationGeneratorSchema {
  name: string;
  configureCypress: boolean;
  generateStories?: boolean;
  generateCypressSpecs?: boolean;
  js?: boolean;
  tsConfiguration?: boolean;
  linter?: Linter;
  cypressDirectory?: string;
  ignorePaths?: string[];
  interactionTests?: boolean;
  configureStaticServe?: boolean;
}
