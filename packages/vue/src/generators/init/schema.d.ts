export interface InitSchema {
  unitTestRunner?: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  routing: boolean;
  skipFormat: boolean;
}
