import { E2eTestRunner, UnitTestRunner } from '@nx/angular';

export interface ConfigurationGeneratorSchema {
  project: string;
  capacitor: boolean;
  skipFormat: boolean;
}
