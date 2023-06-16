import { Linter } from '@nx/linter';
import { Schema } from '../application/schema';

export interface PresetSchema extends Schema {
  name: string;
  vueAppName: string;
  tags?: string;
  directory?: string;
  linter: Linter;
  skipFormat: boolean;
  tailwind?: boolean;
  unitTestRunner: 'vitest' | 'none';
  e2eTestRunner: 'cypress' | 'none';
  standalone?: boolean;
}
