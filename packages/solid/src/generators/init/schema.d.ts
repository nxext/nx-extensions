export interface Schema {
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  bundler?: 'vite';
  skipFormat: boolean;
}
