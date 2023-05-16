export interface Schema {
  unitTestRunner: 'vitest' | 'jest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  bundler?: 'vite';
  skipFormat: boolean;
}
