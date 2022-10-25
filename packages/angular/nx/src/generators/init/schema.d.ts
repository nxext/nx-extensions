import { Linter } from '@nrwl/linter';
import {
  E2eTestRunner,
  UnitTestRunner,
} from '@nrwl/angular/src/utils/test-runners';
import type { Styles } from '../utils/types';

export interface Schema {
  unitTestRunner: UnitTestRunner;
  e2eTestRunner?: E2eTestRunner;
  skipFormat?: boolean;
  skipInstall?: boolean;
  style?: Styles;
  linter: Linter;
}
