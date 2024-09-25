export interface ApplicationGeneratorSchema {
  name: string;
  directory?: string;
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  tags?: string;
  template: 'blank' | 'list' | 'sidemenu' | 'tabs';
  capacitor: boolean;
  skipFormat: boolean;
  standaloneConfig?: boolean;
  bundler?: 'webpack' | 'vite';
}

export interface NormalizedSchema extends ApplicationGeneratorSchema {
  appName: string;
  appProjectName: string;
  appProjectRoot: string;
}
