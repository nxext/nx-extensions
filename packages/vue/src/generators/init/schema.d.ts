export interface InitSchema {
  unitTestRunner?: 'jest' | 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'playwright' | 'none';
  routing: boolean;
  skipFormat: boolean;
}
