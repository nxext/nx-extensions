import { E2eTestRunner, UnitTestRunner } from '@nrwl/angular';

export interface ApplicationGeneratorSchema {
  name: string;
  directory?: string;
  unitTestRunner: UnitTestRunner;
  e2eTestRunner: E2eTestRunner;
  tags?: string;
  template: string;
  capacitor: boolean;
  skipFormat: boolean;
  standaloneConfig?: boolean;
}

export interface NormalizedSchema extends ApplicationGeneratorSchema {
  appName: string;
  prefix: string;
  appProjectName: string;
  appProjectRoot: string;
}
