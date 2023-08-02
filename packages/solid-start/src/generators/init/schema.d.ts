export interface Schema {
  unitTestRunner: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  bundler?: 'vite';
  skipFormat: boolean;
}
