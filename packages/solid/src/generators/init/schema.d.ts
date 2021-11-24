export interface Schema {
  unitTestRunner: 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  bundler?: 'rollup' | 'vite';
  skipFormat: boolean;
}
