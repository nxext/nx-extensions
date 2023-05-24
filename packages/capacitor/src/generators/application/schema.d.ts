export interface AppGeneratorSchema {
  name: string;
  appId: string;
  unitTestRunner: 'vitest' | 'none';
}
